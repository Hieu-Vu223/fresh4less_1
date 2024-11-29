import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function ManageOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Listen for changes in the customerOrders collection
    const unsubscribe = onSnapshot(collection(db, 'customerOrders'), (snapshot) => {
      const fetchedOrders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(fetchedOrders);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Step 1: Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Update the order status in Firestore
      await updateDoc(doc(db, 'customerOrders', orderId), { status: newStatus });
      
      // Notify the customer about the status change
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/notify`, {
        orderId,
        status: newStatus, // Pass the new status for notification
      });
      
      // Optionally update the local state for immediate feedback
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Existing handleRefund function
  const handleRefund = async (paypalOrderId, orderId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/paypal/refund`, { paypalOrderId });
      if (response.data.success) {
        alert('Refund successful');
        await updateOrderStatus(orderId, 'Refunded'); // Update order status to Refunded
      } else {
        alert('Refund failed');
      }
    } catch (error) {
      console.error('Refund error:', error.response ? error.response.data : error.message);
      alert('An error occurred during the refund process.');
    }
  };
  
  return (
    <div>
      <h2>Manage Customer Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="order-item">
          <p>Order ID: {order.id}</p>
          <p>Status: {order.status}</p>
          {order.paypalOrderId ? (
            <>
              <p>PayPal Transaction ID: {order.paypalOrderId}</p>
              {order.status !== 'Refunded' && (
                <button onClick={() => handleRefund(order.paypalOrderId, order.id)}>
                  Refund
                </button>
              )}
              {/* Button to update the order status */}
              {order.status !== 'Refunded' && (
                <button onClick={() => updateOrderStatus(order.id, 'Confirmed')}>
                  Mark as Confirmed
                </button>
              )}
              {/* You can add additional buttons for other statuses here */}
              {order.status === 'Confirmed' && (
                <button onClick={() => updateOrderStatus(order.id, 'Preparing')}>
                  Mark as Preparing
                </button>
              )}
              {order.status === 'Preparing' && (
                <button onClick={() => updateOrderStatus(order.id, 'Ready for Pickup')}>
                  Mark as Ready for Pickup
                </button>
              )}
              {order.status === 'Ready for Pickup' && (
                <button onClick={() => updateOrderStatus(order.id, 'Picked Up')}>
                  Mark as Picked Up
                </button>
              )}
              {order.status !== 'Cancelled' && (
                <button onClick={() => updateOrderStatus(order.id, 'Cancelled')}>
                  Cancel Order
                </button>
              )}
            </>
          ) : (
            <p>No PayPal transaction ID available</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ManageOrders;

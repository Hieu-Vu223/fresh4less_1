import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [feedback, setFeedback] = useState({}); // Store feedback for each order

  useEffect(() => {
    const user = auth.currentUser; // Get the current user

    if (user) {
      // Query for orders belonging to the authenticated user
      const ordersCollection = query(
        collection(db, 'customerOrders'),
        where('customerId', '==', user.uid)
      );

      // Use onSnapshot for real-time updates
      const unsubscribe = onSnapshot(ordersCollection, (snapshot) => {
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData); // Update state with the latest orders
      }, (error) => {
        console.error("Error fetching orders:", error);
      });

      // Clean up the listener on component unmount
      return () => unsubscribe();
    } else {
      console.error("User is not authenticated.");
    }
  }, []);

  // Handle feedback change
  const handleFeedbackChange = (orderId, event) => {
    setFeedback({ ...feedback, [orderId]: event.target.value });
  };

  // Submit feedback
  const submitFeedback = async (orderId) => {
    try {
      const currentFeedback = feedback[orderId];
      if (!currentFeedback) {
        alert('Please enter feedback before submitting.');
        return;
      }

      // Update the order document with the feedback
      await updateDoc(doc(db, 'customerOrders', orderId), {
        feedback: currentFeedback || "", // Save feedback if provided
      });

      alert('Feedback submitted successfully!');
      // Optionally, clear feedback after submission
      setFeedback({ ...feedback, [orderId]: '' }); // Clear the feedback input
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div>
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <p>Order ID: {order.id}</p>
              <p>Status: {order.status}</p>
              <p>Total Amount: ${parseFloat(order.totalAmount || 0).toFixed(2)}</p>
              <p>Order Date: {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</p>
              {/* Display specific message if order is refunded */}
              {order.status === 'Refunded' && <p>This order has been refunded.</p>}

              {/* Feedback Section */}
              <textarea
                placeholder="Leave your feedback here..."
                value={feedback[order.id] || ""}
                onChange={(e) => handleFeedbackChange(order.id, e)}
              />
              <button onClick={() => submitFeedback(order.id)}>Leave Feedback</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrderHistory;

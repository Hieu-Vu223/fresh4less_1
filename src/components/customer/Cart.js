import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../../styles/Cart.css';
import '../../styles/Button.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch cart items from localStorage when the component mounts
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  // Calculate total amount
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2);

  // Handle successful payment approval
  const handleApprove = async (paypalOrderId) => {
    console.log('Payment Approved! PayPal Order ID:', paypalOrderId);
    setPaidFor(true);

    // Save the order with PayPal Order ID to Firestore
    await addOrderToFirestore(paypalOrderId);
  };

  // Function to add order to Firestore with a "Paid" status and PayPal Order ID
  const addOrderToFirestore = async (paypalOrderId) => {
    if (!auth.currentUser) {
      setError("User not authenticated. Please log in again.");
      return;
    }

    const orderData = {
      cartItems,
      totalAmount,
      createdAt: new Date(),
      paypalOrderId, // Store the PayPal Order ID
      status: "Paid",
      customerId: auth.currentUser.uid,
    };
    console.log("Order data being saved:", orderData);
  
    try {
      await addDoc(collection(db, 'customerOrders'), orderData);
      console.log('Order successfully added to Firestore with PayPal transaction ID');
    } catch (error) {
      console.error(`Error adding order to Firestore: ${error.message}`);
      setError('Failed to save the order. Please try again.');
    }
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleContinueBrowsing = () => {
    navigate('/browse-food-offers');
  };

  if (paidFor) {
    return <h1>Thank you for your purchase!</h1>;
  }

  return (
    <div className="cartContainer">
      <h1>Cart</h1>
      <button className="button" onClick={handleContinueBrowsing}>
        Continue Browsing
      </button>

      {cartItems.length === 0 ? (
        <p className="error">Your cart is empty. Please add items to your cart before proceeding.</p>
      ) : (
        <ul className="cartList">
          {cartItems.map((item, index) => (
            <li key={`${item.id}-${index}`}> {/* Unique key using item.id and index */}
              {item.name} - ${item.price.toFixed(2)}
              <button className="button" onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <h2>Total: ${totalAmount}</h2>

      {error && <p className="error">{error}</p>}

      {totalAmount > 0 && (
        <PayPalScriptProvider options={{ "client-id": "AVpmqy_mkdIqFHd1DJA2MZfGaGxkVyc_DJ1TB5uoLmmIA-_nSoUv-x-tCWiVWj1ZWZoNLkA0M4ysnJZj" }}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              if (totalAmount <= 0) {
                console.error("Total amount must be greater than zero.");
                setError("Total amount must be greater than zero.");
                return actions.reject();
              }

              return actions.order.create({
                purchase_units: [
                  {
                    description: "Food Order",
                    amount: { value: totalAmount },
                  },
                ],
              });
            }}
            onApprove={async (data, actions) => {
              try {
                const order = await actions.order.capture();
                handleApprove(order.id); // Pass the PayPal order ID to handleApprove
              } catch (err) {
                setError(err.message || 'Payment capture failed.');
                console.error('Error capturing the order:', err);
              }
            }}
            onError={(err) => {
              setError(err.message || 'An unknown error occurred.');
              console.error("PayPal Checkout onError", err);
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
}

export default Cart;

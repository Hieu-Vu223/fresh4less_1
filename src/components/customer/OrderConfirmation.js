import React from 'react';
import { addDoc, collection } from 'firebase/firestore'; // Firestore methods
import { db } from '../../firebaseConfig'; // Firebase config

function OrderConfirmation({ cartItems }) {
  const handleOrderConfirmation = async () => {
    try {
      await addDoc(collection(db, 'orders'), {
        items: cartItems,
        status: 'pending',
        createdAt: new Date(),
      });
      console.log('Order confirmed');
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  return (
    <div>
      <h1>Review Your Order</h1>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
      <button onClick={handleOrderConfirmation}>Confirm Order</button>
    </div>
  );
}

export default OrderConfirmation;

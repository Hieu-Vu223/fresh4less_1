// src/components/customer/OrderStatus.js
import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function OrderStatus({ orderId }) {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'customerOrders', orderId), (snapshot) => {
      if (snapshot.exists()) {
        setStatus(snapshot.data().status);
      } else {
        setStatus("Order not found");
      }
    });

    return () => unsubscribe();
  }, [orderId]);

  return (
    <div>
      <h2>Order Status</h2>
      <p>Status: {status}</p>
    </div>
  );
}

export default OrderStatus;

// src/components/merchant/ManageOffers.js
import React, { useEffect, useState } from 'react';
import { collection, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function ManageOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'foodOffers'), (snapshot) => {
      const fetchedOffers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOffers(fetchedOffers);
    });
  
    return () => unsubscribe(); 
  }, []);

  const handleUpdate = async (id, updatedData) => {
    try {
      const offerRef = doc(db, 'foodOffers', id);
      await updateDoc(offerRef, updatedData);
      console.log(`Offer ${id} updated successfully.`);
    } catch (error) {
      console.error("Error updating offer:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'foodOffers', id));
      console.log(`Offer ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  };

  return (
    <div>
      <h2>Manage Offers</h2>
      {offers.map((offer) => (
        <div key={offer.id} className="offer-item">
          <input
            type="text"
            value={offer.name}
            onChange={(e) => handleUpdate(offer.id, { name: e.target.value })}
            placeholder="Offer Name"
          />
          <input
            type="number"
            value={offer.price}
            onChange={(e) => handleUpdate(offer.id, { price: Math.max(0.01, parseFloat(e.target.value)) })}
            placeholder="Price"
            min="0.01"
            step="0.01"
          />
          <input
            type="number"
            value={offer.distance}
            onChange={(e) => handleUpdate(offer.id, { distance: Math.max(0.1, parseFloat(e.target.value)) })}
            placeholder="Distance"
            min="0.1"
            step="0.1"
          />
          <input
            type="number"
            value={offer.quantity}
            onChange={(e) => handleUpdate(offer.id, { quantity: Math.max(1, parseInt(e.target.value)) })}
            placeholder="Quantity"
            min="1"
          />
          <select
            value={offer.status}
            onChange={(e) => handleUpdate(offer.id, { status: e.target.value })}
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
          <button onClick={() => handleDelete(offer.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ManageOffers;

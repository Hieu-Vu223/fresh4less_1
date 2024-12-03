import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function ManageOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);  // General loading state for offers
  const [authLoading, setAuthLoading] = useState(true);  // Loading state for authentication
  const [merchantId, setMerchantId] = useState(null);  // State to store merchantId
  const auth = getAuth();

  // Handle authentication state change
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User is logged in:", currentUser.uid);
        setMerchantId(currentUser.uid); // Set the merchantId when the user is authenticated
      } else {
        console.error("User is not authenticated.");
        setMerchantId(null); // Clear merchantId if the user is not authenticated
      }
      setAuthLoading(false);  // Stop loading once auth is complete
    });

    return () => unsubscribeAuth();
  }, [auth]);

  // Fetch offers only when merchantId is set and authentication is complete
  useEffect(() => {
    if (authLoading || !merchantId) {
      return; // Don't fetch offers if authentication is still loading or merchantId is not set
    }

    setLoading(true); // Start loading for fetching offers
    let isMounted = true;  // Flag to track component mount status

    const unsubscribe = onSnapshot(
      collection(db, 'merchants', merchantId, 'foodOffers'),
      (snapshot) => {
        if (isMounted) {  // Only update state if component is still mounted
          const fetchedOffers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setOffers(fetchedOffers);  // Set the fetched data to the offers state
          setLoading(false);  // Stop loading once data is fetched
        }
      },
      (error) => {
        if (isMounted) {  // Only log errors if component is still mounted
          console.error('Error fetching offers:', error);
          setLoading(false);  // Stop loading if an error occurs
        }
      }
    );

    return () => {
      isMounted = false;  // Set the flag to false on unmount
      unsubscribe();  // Cleanup subscription on unmount
    };
  }, [merchantId, authLoading]);

  if (authLoading || loading) {
    return <div>Loading...</div>;  // Display a loading message while fetching data or during auth
  }

  return (
    <div>
      <h2>Manage Offers</h2>
      {offers.length > 0 ? (
        offers.map((offer) => (
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
        ))
      ) : (
        <p>No offers available</p>
      )}
    </div>
  );
}

export default ManageOffers;

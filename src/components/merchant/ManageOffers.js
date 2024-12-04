import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function ManageOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);  // General loading state for offers
  const [authLoading, setAuthLoading] = useState(true);  // Loading state for authentication
  const [merchantId, setMerchantId] = useState(null);  // State to store merchantId
  const [editingOfferId, setEditingOfferId] = useState(null);  // Store the offer being edited
  const [updatedOfferData, setUpdatedOfferData] = useState({});  // Store data for the offer being updated
  const auth = getAuth();

  // Handle updating offer data
  function handleUpdate(offerId, updatedData) {
    // Get the document reference for the offer
    const offerRef = doc(db, 'foodOffers', offerId);
    
    // Update the document with the new data
    updateDoc(offerRef, updatedData)
      .then(() => {
        console.log("Offer updated successfully:", offerId);
        setEditingOfferId(null);  // Reset the editing state after update
      })
      .catch((error) => {
        console.error("Error updating offer:", error);
      });
  }

  // Handle deleting offer
  function handleDelete(offerId) {
    // Get the document reference for the offer to be deleted
    const offerRef = doc(db, 'foodOffers', offerId);

    // Delete the document from Firestore
    deleteDoc(offerRef)
      .then(() => {
        console.log("Offer deleted successfully:", offerId);
        // Optionally, you can remove the deleted offer from the local state
        setOffers(offers.filter((offer) => offer.id !== offerId));
      })
      .catch((error) => {
        console.error("Error deleting offer:", error);
      });
  }

  // Handle changes for the updated offer fields
  function handleFieldChange(e, field) {
    const value = e.target.value;
    setUpdatedOfferData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }

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
      collection(db, 'foodOffers'),
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
            {editingOfferId === offer.id ? (
              <div>
                <input
                  type="text"
                  value={updatedOfferData.name || offer.name}
                  onChange={(e) => handleFieldChange(e, 'name')}
                  placeholder="Offer Name"
                />
                <input
                  type="number"
                  value={updatedOfferData.price || offer.price}
                  onChange={(e) => handleFieldChange(e, 'price')}
                  placeholder="Price"
                  min="0.01"
                  step="0.01"
                />
                <input
                  type="number"
                  value={updatedOfferData.distance || offer.distance}
                  onChange={(e) => handleFieldChange(e, 'distance')}
                  placeholder="Distance"
                  min="0.1"
                  step="0.1"
                />
                <input
                  type="number"
                  value={updatedOfferData.quantity || offer.quantity}
                  onChange={(e) => handleFieldChange(e, 'quantity')}
                  placeholder="Quantity"
                  min="1"
                />
                <select
                  value={updatedOfferData.status || offer.status}
                  onChange={(e) => handleFieldChange(e, 'status')}
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
                <button onClick={() => handleUpdate(offer.id, updatedOfferData)}>Update</button>
              </div>
            ) : (
              <div>
                <p>{offer.name}</p>
                <p>{offer.price} CAD</p>
                <p>{offer.description}</p>
                <p>{offer.status}</p>
                <button onClick={() => setEditingOfferId(offer.id)}>Edit</button>
                <button onClick={() => handleDelete(offer.id)}>Delete</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No offers available</p>
      )}
    </div>
  );
}

export default ManageOffers;

import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import '../../styles/MerchantDashboard.css';
import '../../styles/Button.css';

function MerchantDashboard() {
  const [offerName, setOfferName] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [offerDistance, setOfferDistance] = useState('');
  const [offerQuantity, setOfferQuantity] = useState(1);
  const [offerStatus, setOfferStatus] = useState('available');
  const [newSuccessMessage, setNewSuccessMessage] = useState('');  // Renamed to avoid conflict
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateOffer = async (e) => {
    e.preventDefault();

    // Check if all fields are valid
    if (!offerName || !offerPrice || !offerDistance || !offerQuantity) {
      setErrorMessage("All fields are required and must be greater than zero.");
      return;
    }

    if (parseFloat(offerPrice) <= 0 || parseFloat(offerDistance) <= 0 || parseInt(offerQuantity) <= 0) {
      setErrorMessage("Price, distance, and quantity must be greater than zero.");
      return;
    }

    // Get the currently authenticated user's UID
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setErrorMessage("You must be logged in to create an offer.");
      return;
    }

    try {
      await addDoc(collection(db, 'merchants', user.uid, 'foodOffers'), {
        name: offerName,
        price: parseFloat(offerPrice),
        distance: parseFloat(offerDistance),
        quantity: parseInt(offerQuantity),
        status: offerStatus,
        createdAt: new Date(),
        merchantId: user.uid
      });

      setNewSuccessMessage("Offer created successfully!"); // Updated the success message variable
      setErrorMessage('');
      setOfferName('');
      setOfferPrice('');
      setOfferDistance('');
      setOfferQuantity(1);
      setOfferStatus('available');
    } catch (error) {
      console.error("Error creating offer:", error);
      setErrorMessage("Failed to create offer. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Merchant Dashboard</h1>
      <p>Welcome, merchant! Here you can manage your offers and track orders.</p>

      <h2>Create a New Food Offer</h2>

      <form onSubmit={handleCreateOffer} className="offer-form">
        <div className="form-group">
          <label>Offer Name:</label>
          <input
            type="text"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            placeholder="Enter offer name"
            required
          />
        </div>

        <div className="form-group">
          <label>Price ($):</label>
          <input
            type="number"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            placeholder="Enter price"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Distance (miles):</label>
          <input
            type="number"
            value={offerDistance}
            onChange={(e) => setOfferDistance(e.target.value)}
            placeholder="Enter distance"
            min="0.1"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            value={offerQuantity}
            onChange={(e) => setOfferQuantity(e.target.value)}
            placeholder="Enter quantity"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select
            value={offerStatus}
            onChange={(e) => setOfferStatus(e.target.value)}
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        <button type="submit" className="button">Create Offer</button>
      </form>

      {newSuccessMessage && <p className="success-message">{newSuccessMessage}</p>}  {/* Use the renamed state */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default MerchantDashboard;

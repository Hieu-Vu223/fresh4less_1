import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; // Assuming you have AuthContext to manage user info
import '../../styles/BrowseFoodOffers.css';

function BrowseFoodOffers() {
  const [foodOffers, setFoodOffers] = useState([]);
  const navigate = useNavigate();
  const { user, merchantId} = useAuth(); // Assuming the logged-in user is accessible via AuthContext, // Access merchantId from AuthContext

  // Fetch food offers from Firestore for a specific merchant if they are logged in
  useEffect(() => {
    const fetchFoodOffers = () => {
      let offersQuery;

      if (!user) {
          return
      }

      offersQuery = query(
        collection(db, 'foodOffers') // Query within merchant's foodOffers subcollection
      );

      // Check if the user is a merchant and fetch their specific offers
      // if (user.role === 'merchant') {
      //   // If the user is a merchant, fetch only their offers
      //   offersQuery = query(
      //     collection(db, 'foodOffers') // Query within merchant's foodOffers subcollection
      //   );
      // } else {
      //   // If the user is a customer, fetch all offers
      //   offersQuery = collection(db, 'foodOffers');
      // }

      const unsubscribe = onSnapshot(offersQuery, (snapshot) => {
        const offers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFoodOffers(offers);
      });

      return () => unsubscribe();
    };

    fetchFoodOffers();
  }, [user, merchantId]); // Re-run the effect when user or merchantId changes
  
  // Function to add offer to cart
  const addToCart = (offer) => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...storedCart, offer];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    navigate('/cart');
  };

  return (
    <div className="container">
      <h1>Discover Surplus Food Offers</h1>

      <h2>Recommended for you</h2>
      <div className="offersGrid">
        {foodOffers.map((offer) => (
          <div key={offer.id} className="card">
            <img src={offer.imageURL || "https://via.placeholder.com/150"} alt={offer.name} className="offerImage" />
            <div className="cardContent">
              <h3>{offer.name}</h3>
              <p>{offer.price} CAD</p>
              <p>{offer.description}</p>
              <button
                onClick={() => addToCart(offer)}
                disabled={offer.status !== 'available'}
              >
                {offer.status === 'available' ? 'Claim Offer' : 'Unavailable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowseFoodOffers;

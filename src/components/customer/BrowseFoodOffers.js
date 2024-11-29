import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../../styles/BrowseFoodOffers.css';

function BrowseFoodOffers() {
  const [foodOffers, setFoodOffers] = useState([]);
  const navigate = useNavigate();

  // Fetch food offers from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'foodOffers'), (snapshot) => {
      const offers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFoodOffers(offers);
    });

    return () => unsubscribe();
  }, []);

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

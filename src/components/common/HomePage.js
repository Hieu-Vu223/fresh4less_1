// src/components/common/HomePage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; // Adjust path if needed
import '../../styles/Button.css'; // Ensure this path is correct for your project structure

function HomePage() {
  const navigate = useNavigate();
  const { role, loading, logout } = useAuth(); // Get role, loading, and logout from AuthContext

  if (loading) return <p>Loading...</p>; // Show loading message while user/role is being fetched

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <h1>Welcome to Fresh4Less</h1>

      {/* Navigation buttons to core features for customers */}
      <div>
        <h2>Explore Our Features:</h2>
        <Link to="/browse-food-offers">
          <button className="button">Browse Surplus Food Offers</button>
        </Link>
        <Link to="/cart">
          <button className="button">Your Cart</button>
        </Link>
        <Link to="/order-history">
          <button className="button">Track Your Order</button>
        </Link>
      </div>

      {/* Only show Merchant Portal if the user is a merchant */}
      {role === 'merchant' && (
        <div>
          <h2>Merchant Portal:</h2>
          <Link to="/merchant-dashboard">
            <button className="button">Go to Merchant Dashboard</button>
          </Link>
        </div>
      )}


      {/* Logout button */}
      <div style={{ marginTop: '20px' }}>
        <button className="button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default HomePage;

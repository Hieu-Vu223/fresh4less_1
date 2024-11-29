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
      {/* Hero Section */}
      <header style={{ backgroundColor: '#E0F7FA', textAlign: 'center', padding: '50px 0' }}>
        <h1>Welcome to Fresh4Less</h1>
        <p style={{ fontSize: '20px', color: '#00796B' }}>
          Save Food. Save Money. Help the Planet.
        </p>
        {/* Actionable CTA Buttons */}
        <div style={{ marginTop: '20px' }}>
          <Link to="/browse-food-offers">
            <button className="button" style={{ padding: '10px 20px', fontSize: '16px'}}>
              Log In
            </button>
          </Link>
          <Link to="/signup">
            <button className="button" style={{ padding: '10px 20px', fontSize: '16px'}}>
              Sign Up
            </button>
          </Link>
        </div>
      </header>

      {/* Core Features Section */}
      <section style={{ padding: '30px 20px', backgroundColor: '#f4f4f4', textAlign: 'center' }}>
        <h2>How It Works</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '250px', marginBottom: '20px' }}>
            <h3>For Merchants: Sell Surplus Food</h3>
            <p>List your surplus food offers on Fresh4Less and sell to local customers at discounted prices. Reduce waste and increase your revenue!</p>
          </div>
          <div style={{ maxWidth: '250px', marginBottom: '20px' }}>
            <h3>For Customers: Buy Surplus Food</h3>
            <p>Explore discounted food offers from local businesses and save money on meals, all while helping reduce food waste.</p>
          </div>
          <div style={{ maxWidth: '250px', marginBottom: '20px' }}>
            <h3>Help the Planet</h3>
            <p>By buying or selling surplus food, you help minimize food waste, contribute to sustainability, and make a positive impact on the environment.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '30px 20px', backgroundColor: '#E0F7FA', textAlign: 'center' }}>
        <h2>What Our Users Are Saying</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '300px' }}>
            <p>"I saved 60% on a meal I was planning to throw away. Awesome app!"</p>
            <strong>- Sarah, Customer</strong>
          </div>
          <div style={{ maxWidth: '300px' }}>
            <p>"This is such a great initiative. I love being able to save money while helping the environment!"</p>
            <strong>- John, Customer</strong>
          </div>
          <div style={{ maxWidth: '300px' }}>
            <p>"Listing my surplus food on Fresh4Less has helped me make extra money and reduce waste. I highly recommend it!"</p>
            <strong>- Michael, Merchant</strong>
          </div>
        </div>
      </section>

      {/* Merchant Portal (Visible for merchants only) */}
      {role === 'merchant' && (
        <section style={{ padding: '30px 20px', textAlign: 'center' }}>
          <h2>Merchant Portal</h2>
          <Link to="/merchant-dashboard">
            <button className="button" style={{ padding: '10px 20px', fontSize: '16px' }}>
              Go to Merchant Dashboard
            </button>
          </Link>
        </section>
      )}

      {/* Footer */}
      <footer style={{ backgroundColor: '#00796B', color: '#fff', padding: '20px 0', textAlign: 'center' }}>
        <div>
          <Link to="/about-us" style={{ color: '#fff', marginRight: '15px' }}>About Us</Link>
          <Link to="/terms" style={{ color: '#fff', marginRight: '15px' }}>Terms & Conditions</Link>
          <Link to="/privacy" style={{ color: '#fff', marginRight: '15px' }}>Privacy Policy</Link>
          <Link to="/contact" style={{ color: '#fff' }}>Contact</Link>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;

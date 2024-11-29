import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; // Adjust path if needed
import '../../styles/NavBar.css';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, role } = useAuth(); // Get role from AuthContext

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="navbar">
      {/* Render links based on the user's role */}
      {role === 'merchant' && (
        <>
          <Link to="/merchant-dashboard" className={location.pathname === '/merchant-dashboard' ? 'active' : ''}>
            Merchant Dashboard
          </Link>
          <Link to="/manage-offers" className={location.pathname === '/manage-offers' ? 'active' : ''}>
            Manage Offers
          </Link>
          <Link to="/manage-orders" className={location.pathname === '/manage-orders' ? 'active' : ''}>
            Manage Orders
          </Link>
        </>
      )}

      {role === 'customer' && (
        <>
          <Link to="/browse-food-offers" className={location.pathname === '/browse-food-offers' ? 'active' : ''}>
            Browse Offers
          </Link>
          <Link to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>
            Cart
          </Link>
          <Link to="/order-history" className={location.pathname === '/order-history' ? 'active' : ''}>
            Order History
          </Link>
        </>
      )}

      {role === 'admin' && (
        <Link to="/admin/dashboard" className={location.pathname === '/admin/dashboard' ? 'active' : ''}>
          Admin Dashboard
        </Link>
      )}

      {/* Logout button */}
      <button onClick={handleLogout} className="button logout-button">
        Logout
      </button>
    </nav>


  );
}

// // Extend NavBar with admin links
// <NavBar>
//   <li><a href="/admin">Dashboard</a></li>
//   <li><a href="/admin/manage-users">Manage Users</a></li>
// </NavBar>

export default NavBar;

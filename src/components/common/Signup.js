import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'; // Added serverTimestamp
import { auth, db } from '../../firebaseConfig'; // Import db here
import { useAuth } from '../auth/AuthContext'; // Import useAuth to get currentRole

function Signup() {
  const { role: currentRole } = useAuth(); // Get current user's role
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // New state for user role
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Create a new user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Add user data to Firestore with `createdAt` field
      const userData = {
        uid: user.uid,
        fullName: fullName,
        email: email,
        role: role, // Dynamic role based on user selection
        status: 'active', // Default status
        createdAt: serverTimestamp(), // Timestamp for when the user is created
      };

      // For merchants, add merchantID and any additional merchant data
      if (role === 'merchant') {
        userData.merchantID = user.uid; // Set the merchantID as the user's UID
      } 
      // For customers, add customer-specific data like cart and order history
      else if (role === 'customer') {
        userData.customerID = user.uid; // Set the customerID as the user's UID
        // Initialize empty cart and order history for customers
        userData.cart = []; // Empty cart array
        userData.orderHistory = []; // Empty order history array
      }

      // Step 3: Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), userData);

      // Step 4: Send verification email
      await sendEmailVerification(user);
      setMessage('Verification email sent! Please check your inbox.');

      console.log('User signed up:', fullName, email, 'with role:', role);

      // Step 5: Redirect to the login page after signup
      setTimeout(() => {
        navigate('/login'); // Redirect after a short delay
      }, 3000);
    } catch (err) {
      // Step 6: Handle errors
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Signup Page</h1>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Dropdown for selecting role */}
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="merchant">Merchant</option>
            {currentRole === 'admin' && <option value="admin">Admin</option>} {/* Only show Admin if the current user is admin */}
          </select>
        </label>

        <button type="submit">Sign Up</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Already have an account? <Link to="/login">Log in here</Link></p>
    </div>
  );
}

export default Signup;

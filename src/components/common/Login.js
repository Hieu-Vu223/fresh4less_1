import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

// Manage user inputs and error messages
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect users to the appropriate page after login
  const navigate = useNavigate();

  // Fetch the user's role and status from Firebase
  const fetchUserData = async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() : null;
  };

  // Handle errors during authentication or role fetching
  const mapFirebaseError = (error) => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  // Authenticate the user, fetch their data, and redirect accordingly
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Step 1: Set session persistence to remember login across browser refreshes
      await setPersistence(auth, browserLocalPersistence);

      // Step 2: Authenticate the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Extract the authenticated user's unique ID
      const uid = userCredential.user.uid;

      // Step 3: Fetch user data (role and status)
      const userData = await fetchUserData(uid);

      if (!userData) {
        setError('User data not found. Please contact support.');
        return;
      }

      // Step 4: Check if the user is suspended (but allow admin accounts to log in)
      if (userData.status === 'suspended' && userData.role !== 'admin') {
        setError('Your account has been suspended. Please contact support for assistance.');
        return;
      }

      // Step 5: Redirect the user based on their role
      const { role } = userData;
      console.log('Role retrieved in Login:', role); // Debug log

      if (role === 'merchant') {
        navigate('/merchant-dashboard');
      } else if (role === 'customer') {
        navigate('/browse-food-offers');
      } else if (role === 'admin') {
        navigate('/admin/dashboard'); // Redirects admin users to the correct dashboard
      } else {
        setError('Role not found or invalid. Contact support.');
      }
    } catch (err) {
      // Map errors to user-friendly messages
      setError(mapFirebaseError(err));
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
      <p><Link to="/password-reset">Forgot Password?</Link></p>
    </div>
  );
}

export default Login;

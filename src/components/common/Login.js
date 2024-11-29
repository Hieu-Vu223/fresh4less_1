import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Handle loading state for login
  const navigate = useNavigate();

  // Fetch user data (role and status) from Firestore based on user UID
  const fetchUserData = async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() : null;
  };

  // Map Firebase authentication errors to user-friendly messages
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

  // Handle user login process
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading while logging in
    setError('');  // Reset any previous errors

    try {
      // Step 1: Set session persistence for login
      await setPersistence(auth, browserLocalPersistence);

      // Step 2: Authenticate the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Step 3: Fetch user data (role and status) from Firestore
      const userData = await fetchUserData(uid);
      if (!userData) {
        setError('User data not found. Please contact support.');
        setLoading(false);
        return;
      }

      // Step 4: Check if the user is suspended (allow admins to log in)
      if (userData.status === 'suspended' && userData.role !== 'admin') {
        setError('Your account has been suspended. Please contact support.');
        setLoading(false);
        return;
      }

      // Step 5: Redirect based on the user's role
      const { role } = userData;
      if (role === 'merchant') {
        navigate('/merchant-dashboard');
      } else if (role === 'customer') {
        navigate('/browse-food-offers');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Role not found or invalid. Contact support.');
      }
    } catch (err) {
      setError(mapFirebaseError(err));
      setLoading(false); // Stop loading if there's an error
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Login</h1>
      
      {/* Login Form */}
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '10px', marginBottom: '10px', width: '300px' }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '10px', marginBottom: '20px', width: '300px' }}
          />
        </div>
        <button type="submit" className="button" style={{ padding: '10px 20px' }} disabled={loading}>
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </form>

      {/* Display error messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Sign Up and Password Reset Links */}
      <div style={{ marginTop: '15px' }}>
        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
        <p>
          <Link to="/password-reset">Forgot Password?</Link>
        </p>
      </div>

      {/* Navigate to Home Button */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/')} className="button" style={{ padding: '10px 20px' }}>
          Back to HomePage
        </button>
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Import Firebase auth instance
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook for redirection

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const actionCodeSettings = {
      // Redirect URL after the password is reset
      url: 'http://localhost:3000/login', // Change to your site's login page
      handleCodeInApp: true,
    };

    try {
      // Step 1: Send the password reset email
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setMessage('A password reset email has been sent to your email address.');

      // Step 2: Redirect to the login page after a short delay
      setTimeout(() => {
        navigate('/login'); // Redirect after 3 seconds
      }, 3000); // 3000ms = 3 seconds
    } catch (err) {
      // Step 3: Handle errors
      setError('Failed to send password reset email. Please check your email address and try again.');
      console.error(err);
    }
  };

  return (
    <div className="password-reset-container" style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handlePasswordReset}>
        <label htmlFor="email">Enter your email address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', marginBottom: '10px', width: '300px' }}
        />
        <button type="submit" className="button" style={{ padding: '10px 20px' }}>
          Send Reset Email
        </button>
      </form>

      {/* Display success or error messages */}
      {message && <p style={{ color: 'green' }} className="success-message">{message}</p>}
      {error && <p style={{ color: 'red' }} className="error-message">{error}</p>}
    </div>
  );
}

export default PasswordReset;

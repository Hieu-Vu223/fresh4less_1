import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Import Firebase auth instance

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
      await sendPasswordResetEmail(auth, email, actionCodeSettings); // Send reset email with redirect link
      setMessage('A password reset email has been sent to your email address.');
    } catch (err) {
      setError('Failed to send password reset email. Please check your email address and try again.');
      console.error(err);
    }
  };

  return (
    <div className="password-reset-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handlePasswordReset}>
        <label htmlFor="email">Enter your email address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Email</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default PasswordReset;

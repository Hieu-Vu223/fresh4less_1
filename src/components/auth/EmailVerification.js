// src/components/auth/EmailVerification.js
import React, { useState } from 'react';
import { sendEmailVerification } from 'firebase/auth'; // Firebase email verification function
import { auth } from '../../firebaseConfig'; // Firebase config

function EmailVerification() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Firebase auth instance should have the user signed in already
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setMessage('Verification email sent! Please check your inbox.');
      } else {
        setError('No user is currently logged in.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Email Verification</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Verification Email</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default EmailVerification;

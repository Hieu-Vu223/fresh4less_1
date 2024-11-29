import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth'; // Firebase password reset function
import { auth } from '../../firebaseConfig'; // Firebase config
import { useNavigate } from 'react-router-dom'; // Hook to navigate back to login page

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // To show success message
  const [error, setError] = useState(''); // To show error message
  const navigate = useNavigate(); // Hook to navigate back to login page

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
      setError(''); // Clear any previous errors
      setEmail(''); // Clear the email input field
    } catch (err) {
      setError(err.message); // Set error if the email fails to send
      setMessage(''); // Clear any previous success messages
    }
  };

  return (
    <div>
      <h1>Password Reset</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Password Reset Email</button>
      </form>

      {/* Show success message and button to navigate to login */}
      {message && (
        <div>
          <p style={{ color: 'green' }}>{message}</p>
          <button onClick={() => navigate('/login')}>Go back to Login</button> {/* Navigate to login */}
        </div>
      )}

      {/* Show error message if something goes wrong */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default PasswordReset;

import React, { useEffect, useState } from 'react';
import { fetchUsers, suspendUser, approveUser, deleteUser } from '../../services/userService';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Load users when the component is mounted
  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    }
    loadUsers();
  }, []);

  const handleSuspend = async (uid) => {
    try {
      await suspendUser(uid);
      setUsers(users.map((user) => (user.id === uid ? { ...user, status: 'suspended' } : user)));
      alert('User has been suspended.');
    } catch (error) {
      console.error('Error suspending user:', error);
      setError(error.message); // Display error for suspension
    }
  };

  const handleApprove = async (uid) => {
    try {
      await approveUser(uid);
      setUsers(users.map((user) => (user.id === uid ? { ...user, status: 'approved' } : user)));
      alert('User has been approved.');
    } catch (error) {
      console.error('Error approving user:', error);
      setError('Failed to approve user.');
    }
  };

  const handleDelete = async (uid) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (confirmDelete) {
      try {
        await deleteUser(uid);
        setUsers(users.filter((user) => user.id !== uid));
        alert('User deleted successfully.');
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete the user.');
      }
    }
  };

  return (
    <div>
      <h1>Manage Users</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.fullName || 'N/A'}</td>
              <td>{user.email || 'N/A'}</td>
              <td>{user.role || 'N/A'}</td>
              <td>{user.createdAt || 'N/A'}</td>
              <td>{user.status}</td>
              <td>
                {/* Exclude admin accounts from actions */}
                {user.role !== 'admin' ? (
                  <>
                    {user.status !== 'approved' && (
                      <button onClick={() => handleApprove(user.id)}>Approve</button>
                    )}
                    {user.status !== 'suspended' && (
                      <button onClick={() => handleSuspend(user.id)}>Suspend</button>
                    )}
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </>
                ) : (
                  <span style={{ color: 'gray' }}>Not Editable</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;

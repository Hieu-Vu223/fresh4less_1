import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function ListingsTable() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);  // Loading state for fetching data
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStatus, setNewStatus] = useState('available');  // Default status is 'available'

  // Fetch food listings from Firestore
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'foodOffers'));
        const fetchedListings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setListings(fetchedListings);
      } catch (error) {
        console.error('Error fetching food listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Function to handle edit click and set values for editing
  const handleEdit = (listing) => {
    setEditingId(listing.id);
    setNewTitle(listing.name);
    setNewPrice(listing.price);
    setNewStatus(listing.status);
  };

  // Function to save the changes to the listing
  const handleSave = async (id) => {
    const listingRef = doc(db, 'foodOffers', id);
    try {
      await updateDoc(listingRef, {
        name: newTitle,
        price: newPrice,
        status: newStatus
      });
      setEditingId(null);  // Clear editing state
      alert('Listing updated successfully!');
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  // Function to delete the listing
  const handleDelete = async (id) => {
    const listingRef = doc(db, 'foodOffers', id);
    try {
      await deleteDoc(listingRef);
      alert('Listing deleted successfully!');
      setListings(listings.filter(listing => listing.id !== id));  // Remove from state
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Manage Listings</h1>
      <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Listing ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id}>
              <td>{listing.id}</td>
              {/* Editable fields if it's the listing being edited */}
              <td>
                {editingId === listing.id ? (
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                ) : (
                  listing.name
                )}
              </td>
              <td>
                {editingId === listing.id ? (
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                ) : (
                  `$${listing.price}`
                )}
              </td>
              <td>
                {editingId === listing.id ? (
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                ) : (
                  listing.status
                )}
              </td>
              <td>
                {editingId === listing.id ? (
                  <button onClick={() => handleSave(listing.id)}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(listing)}>Edit</button>
                    <button onClick={() => handleDelete(listing.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListingsTable;

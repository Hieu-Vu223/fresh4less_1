import React from 'react';

function ListingsTable() {
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
          <tr>
            <td>1</td>
            <td>Example Food Item</td>
            <td>$10</td>
            <td>Active</td>
            <td>
              <button>Edit</button>
              <button>Delete</button>
            </td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
}

export default ListingsTable;

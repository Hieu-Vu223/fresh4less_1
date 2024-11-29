import React from 'react';
import NavBar from '../common/NavBar';
import { Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <div>
      <NavBar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <aside style={{ width: '200px', padding: '20px', background: '#f4f4f4' }}>
          <nav>
            <ul>
              <li><a href="/admin/dashboard">Dashboard</a></li>
              <li><a href="/admin/users">Manage Users</a></li>
              <li><a href="/admin/merchants">Verify Merchants</a></li>
              <li><a href="/admin/listings">Manage Listings</a></li>
            </ul>
          </nav>
        </aside>
        <main style={{ padding: '20px', flexGrow: 1 }}>
          <Outlet /> {/* Render child routes */}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

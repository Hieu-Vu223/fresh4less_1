// src/components/customer/UserLayout.js

import React from 'react';
import NavBar from '../common/NavBar'; // Make sure path is correct
import { Outlet } from 'react-router-dom';

function UserLayout() {
  return (
    <div>
      <NavBar role="customer" /> {/* Single NavBar for customer navigation */}
      <div className="content">
        <Outlet /> {/* Renders child components based on route */}
      </div>
    </div>
  );
}

export default UserLayout;

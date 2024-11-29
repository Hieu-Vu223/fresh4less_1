// src/components/MerchantLayout.js

import React from 'react';
import NavBar from '../common/NavBar';
import { Outlet } from 'react-router-dom';

function MerchantLayout() {
  return (
    <div>
      <NavBar role="merchant" /> {/* Merchant-specific navigation */}
      <div className="content">
        <Outlet /> {/* Renders child components based on route */}
      </div>
    </div>
  );
}

export default MerchantLayout;

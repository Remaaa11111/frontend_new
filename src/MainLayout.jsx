import React from 'react';
import Sidenav from './Sidenav';
import { Outlet } from 'react-router-dom';

const MainLayout = () => (
  <>
    <Sidenav />
    <div style={{ marginLeft: 220, minHeight: '100vh', background: '#f0f2f5', padding: 24 }}>
      <Outlet />
    </div>
  </>
);

export default MainLayout; 
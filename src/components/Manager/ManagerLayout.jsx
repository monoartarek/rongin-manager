import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ManagerSidebar from '../Sidebar/Sidebar';
import ManagerNavbar from '../Navbar/Navbar';
import './Manager.css';

const ManagerLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <ManagerSidebar 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        marginLeft: window.innerWidth > 768 ? '260px' : '0'
      }}>
        <ManagerNavbar 
          onHamburgerClick={() => setIsMobileOpen(!isMobileOpen)} 
        />
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '30px',
          WebkitOverflowScrolling: 'touch' // Important for iOS
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ManagerLayout;
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const PermissionRoute = ({ children, requiredPermission }) => {
  const { permissions, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#fff',
        background: '#0a0a1a'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Check if permissions array exists and includes the required permission
  if (!Array.isArray(permissions) || !permissions.includes(requiredPermission)) {
    console.log(`❌ Access Denied: Missing permission "${requiredPermission}"`);
    return <Navigate to="/manager/unauthorized" replace />;
  }

  return children;
};

export default PermissionRoute;
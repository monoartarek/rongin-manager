import React, { createContext, useState, useContext, useEffect } from 'react';
import Parse from './parseConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = Parse.User.current();
      if (user) {
        const userData = user.toJSON();
        console.log('👤 Current user:', userData.username, '| Role:', userData.role);
        setCurrentUser(userData);
        
        if (userData.role === 'manager') {
          // First try to get from localStorage
          const storedPermissions = localStorage.getItem('managerPermissions');
          if (storedPermissions) {
            try {
              const parsed = JSON.parse(storedPermissions);
              console.log('📦 Loaded permissions from localStorage:', parsed);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setPermissions(parsed);
              }
            } catch (e) {
              console.error('❌ Error parsing stored permissions:', e);
              localStorage.removeItem('managerPermissions');
            }
          }
          
          // Always fetch fresh permissions from server
          await fetchPermissions(userData.username);
        }
      } else {
        console.log('👤 No user logged in');
      }
    } catch (error) {
      console.error('❌ Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async (username) => {
    try {
      console.log('🔄 Fetching permissions from Parse for:', username);
      
      const Panels = Parse.Object.extend('panels');
      const query = new Parse.Query(Panels);
      query.equalTo('username', username);
      query.equalTo('role', 'manager');
      
      const result = await query.first();
      
      if (result) {
        const panelData = result.toJSON();
        console.log('📋 Raw panel data from server:', panelData);
        
        // Get permissions from the result
        let perms = result.get('permissions');
        console.log('🔑 Permissions from get():', perms);
        
        // Handle different formats
        if (Array.isArray(perms)) {
          // It's already an array
          console.log('✅ Permissions is an array with', perms.length, 'items');
        } else if (typeof perms === 'string') {
          // Try to parse if it's a JSON string
          try {
            perms = JSON.parse(perms);
            console.log('🔄 Parsed string to array:', perms);
          } catch (e) {
            console.error('❌ Failed to parse permissions string:', e);
            perms = [];
          }
        } else if (panelData.permissions && Array.isArray(panelData.permissions)) {
          // Use from JSON if get() didn't work
          perms = panelData.permissions;
          console.log('🔄 Using permissions from JSON:', perms);
        } else {
          console.log('⚠️ No valid permissions found, using empty array');
          perms = [];
        }
        
        // Ensure it's an array
        if (!Array.isArray(perms)) {
          console.log('⚠️ Converting to array');
          perms = [];
        }
        
        console.log('✅ Final permissions:', perms);
        setPermissions(perms);
        
        // Store in localStorage
        localStorage.setItem('managerPermissions', JSON.stringify(perms));
      } else {
        console.log('⚠️ No panel data found for user:', username);
        setPermissions([]);
        localStorage.removeItem('managerPermissions');
      }
    } catch (error) {
      console.error('❌ Error fetching permissions:', error);
      setPermissions([]);
    }
  };

  const login = async (username, password) => {
    try {
      console.log('🔐 Attempting login for:', username);
      const user = await Parse.User.logIn(username, password);
      const userData = user.toJSON();
      
      console.log('👤 Logged in user:', userData.username, '| Role:', userData.role);
      
      if (userData.role !== 'manager') {
        await Parse.User.logOut();
        throw new Error('Access denied. Only managers can login.');
      }
      
      setCurrentUser(userData);
      await fetchPermissions(username);
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      console.log('👋 Logging out');
      await Parse.User.logOut();
      setCurrentUser(null);
      setPermissions([]);
      localStorage.removeItem('managerPermissions');
    } catch (error) {
      console.error('❌ Error logging out:', error);
      // Force clear even if Parse fails
      setCurrentUser(null);
      setPermissions([]);
      localStorage.removeItem('managerPermissions');
    }
  };

  const hasPermission = (componentKey) => {
    // Make sure permissions is an array before checking
    if (!Array.isArray(permissions)) {
      console.warn('⚠️ hasPermission: permissions is not an array:', permissions);
      return false;
    }
    const result = permissions.includes(componentKey);
    return result;
  };

  const value = {
    currentUser,
    permissions,
    loading,
    login,
    logout,
    hasPermission,
    fetchPermissions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
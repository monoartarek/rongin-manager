import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import "./Sidebar.css";
import { 
  LayoutDashboard, Users, UserCog, Gift, MessageSquare, 
  Settings, BarChart, LogOut, Shield, Image, Video,
  TrendingUp, DollarSign, Clock, FileText, X,
  AlertCircle, Star, Frame, Palette, Sparkles, Megaphone,
  Gamepad2, Radio, History, Ban
} from 'lucide-react';

const ManagerSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { permissions, currentUser, logout, fetchPermissions } = useAuth();
  const navigate = useNavigate();

  // DEBUG: Log permissions on mount and when they change
  useEffect(() => {
    console.log('========================================');
    console.log('🔍 SIDEBAR - Current User:', currentUser?.username);
    console.log('🔍 SIDEBAR - Permissions Array:', permissions);
    console.log('🔍 SIDEBAR - Permissions Type:', typeof permissions);
    console.log('🔍 SIDEBAR - Is Array:', Array.isArray(permissions));
    console.log('🔍 SIDEBAR - Permissions Length:', permissions?.length);
    
    // If permissions is string (from localStorage), parse it
    if (typeof permissions === 'string') {
      console.log('⚠️ Permissions is a STRING, need to parse!');
    }
  }, [permissions, currentUser]);

  // Force fetch permissions if empty on mount
  useEffect(() => {
    if (currentUser?.username && (!permissions || permissions.length === 0)) {
      console.log('🔄 Fetching permissions for:', currentUser.username);
      fetchPermissions(currentUser.username);
    }
  }, [currentUser]);

  const handleNavClick = () => {
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  const handleBackdropClick = () => {
    setIsMobileOpen(false);
  };

  const allSidebarItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/manager/dashboard' },
    { key: 'panels', label: 'Panels', icon: <LayoutDashboard size={20} />, path: '/manager/panels' },
    { key: 'manager', label: 'Managers', icon: <UserCog size={20} />, path: '/manager/manager' },
    { key: 'reseller', label: 'Resellers', icon: <Users size={20} />, path: '/manager/reseller' },
    { key: 'users', label: 'Users', icon: <Users size={20} />, path: '/manager/users' },
    { key: 'app_admin', label: 'App Admin', icon: <Shield size={20} />, path: '/manager/app-admin' },
    { key: 'host_agency', label: 'Host Agency', icon: <Users size={20} />, path: '/manager/host-agency' },
    { key: 'daily_bonus', label: 'Daily Bonus', icon: <DollarSign size={20} />, path: '/manager/daily-bonus' },
    { key: 'live_bonus', label: 'Live Bonus', icon: <DollarSign size={20} />, path: '/manager/live-bonus' },
    { key: 'live_streams', label: 'Live Streams', icon: <Radio size={20} />, path: '/manager/live-streams' },
    { key: 'splash_banner', label: 'Splash Banner', icon: <Image size={20} />, path: '/manager/splash-banner' },
    { key: 'banner_image', label: 'Banner Image', icon: <Image size={20} />, path: '/manager/banner-image' },
    { key: 'messages', label: 'Messages', icon: <MessageSquare size={20} />, path: '/manager/messages' },
    { key: 'posts', label: 'Posts', icon: <FileText size={20} />, path: '/manager/posts' },
    { key: 'comments', label: 'Comments', icon: <MessageSquare size={20} />, path: '/manager/comments' },
    { key: 'stories', label: 'Stories', icon: <Video size={20} />, path: '/manager/stories' },
    { key: 'official_announce', label: 'Announcements', icon: <Megaphone size={20} />, path: '/manager/official-announce' },
    { key: 'gifts', label: 'Gifts', icon: <Gift size={20} />, path: '/manager/gifts' },
    { key: 'vip', label: 'VIP', icon: <Star size={20} />, path: '/manager/vip' },
    { key: 'avatar_frame', label: 'Avatar Frame', icon: <Frame size={20} />, path: '/manager/avatar-frame' },
    { key: 'party_theme', label: 'Party Theme', icon: <Palette size={20} />, path: '/manager/party-theme' },
    { key: 'entrance_effect', label: 'Entrance Effect', icon: <Sparkles size={20} />, path: '/manager/entrance-effect' },
    { key: 'salary_reports', label: 'Salary Reports', icon: <DollarSign size={20} />, path: '/manager/salary-reports' },
    { key: 'top_streams', label: 'Top Streams', icon: <TrendingUp size={20} />, path: '/manager/top-streams' },
    { key: 'gift_coins_history', label: 'Gift/Coins History', icon: <History size={20} />, path: '/manager/gift-coins-history' },
    { key: 'game_history', label: 'Game History', icon: <Gamepad2 size={20} />, path: '/manager/game-history' },
    { key: 'app_settings', label: 'App Settings', icon: <Settings size={20} />, path: '/manager/app-settings' },
    { key: 'report', label: 'Reports', icon: <AlertCircle size={20} />, path: '/manager/report' },
    { key: 'login_history', label: 'Login History', icon: <Clock size={20} />, path: '/manager/login-history' },
    { key: 'users_device_ban', label: 'Device Ban', icon: <Ban size={20} />, path: '/manager/users-device-ban' },
  ];

  // FILTER items based on permissions
  const authorizedItems = allSidebarItems.filter(item => {
    // Ensure permissions is an array before checking
    const perms = Array.isArray(permissions) ? permissions : [];
    const isAuthorized = perms.includes(item.key);
    
    // Debug each item
    if (perms.length > 0) {
      console.log(`  ➜ ${item.key}: ${isAuthorized ? '✅ SHOWN' : '❌ HIDDEN'}`);
    }
    
    return isAuthorized;
  });

  console.log(`📊 Showing ${authorizedItems.length} of ${allSidebarItems.length} items`);

  const handleLogout = async () => {
    await logout();
    navigate('/manager/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`manager-sidebar-backdrop ${isMobileOpen ? 'show' : ''}`}
        onClick={handleBackdropClick}
      />

      {/* Sidebar */}
      <div className={`manager-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Mobile Close Button */}
        <button 
          className="manager-sidebar-close-btn"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

        <div className="manager-sidebar-header">
          <h2>Manager Panel</h2>
          <div className="manager-info">
            <span>{currentUser?.name || currentUser?.username}</span>
            <span className="manager-role-badge">Manager</span>
          </div>
          {authorizedItems.length > 0 && (
            <div className="permission-count">
              {authorizedItems.length} of {allSidebarItems.length} panels
            </div>
          )}
        </div>
        
        {/* No permissions state */}
        {(!Array.isArray(permissions) || permissions.length === 0) ? (
          <div className="no-permissions-message">
            <AlertCircle size={40} />
            <p>No permissions assigned</p>
            <span>Contact administrator for access</span>
          </div>
        ) : (
          <nav className="manager-sidebar-nav">
            {authorizedItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) => 
                  `manager-sidebar-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        )}

        <div className="manager-sidebar-footer">
          <button onClick={handleLogout} className="manager-logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ManagerSidebar;
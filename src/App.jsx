import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Admin component import 
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';

// Admin pages import 
import Dashboard from './Pages/Dashboard';
import MarketCoins from './Pages/MarketCoins';
import AllUsers from './Pages/AllUsers';
import MakeManager from './Pages/MakeOrRemoveManager';
import MakeReseller from './Pages/MakeReseller';
import AppadminPage from './Pages/MakeAppAdmin';  
import AllEarnings from './Pages/AllEarnings';
import AllAgencyHistory from './Pages/AllAgencyHistory';
import DailyBonusPage from './Pages/DailyBonus';
import AppSettingsPage from './Pages/AppSettings';
import Posts from './Pages/Posts';
import Comments from './Pages/Comments';
import BannerPage from './Pages/Banner';
import SplashBannerPage from './Pages/SplashBanner';
import LiveBonusPage from './Pages/LiveBonus';
import LiveStreaming from './Pages/LiveStreaming';
import TopStreamsPage from './Pages/TopStreams';  
import StoriesPage from './Pages/Stories';
import GiftsPage from './Pages/AllGifts';
import AddNewGiftsPage from './Pages/AddNewGifts';
import AddNewAssetsPage from './Pages/AddNewAssets';
import AddNewFramePage from './Pages/AddNewFrame';
import AddPartyThemesPage from './Pages/AddPartyThemes';
import AddEntranceEffectPage from './Pages/AddEntranceEffect';
import AllAnnouncementsPage from './Pages/Announcements';
import AddNewAnnouncementPage from './Pages/AddNewAnnouncement';
import GamesHistoryPage from './Pages/GamesHistory';
import AgoraPage from './Pages/Agora';
import ReportsPage from './Pages/Reports';
import AllAgency from './Pages/AllAgency';
import AllMessagesPage from './Pages/AllMessages';
import AdminLoginHistoryPage from './Pages/AdminLoginHistory';
import BannedDevicePage from './Pages/BannedDevice';
import SalaryQueryPage from './Pages/SalaryQuery';
import FullReportPage from './Pages/FullReport';
import GiftHistoryPage from './Pages/GiftHistory';
import CoinHistoryPage from './Pages/CoinHistory';

import Login from './Pages/Login';
import Profile from "./Pages/Profile";

import ProtectedRoute from './components/ProtectedRoute';
import ManagerProtectedRoute from './components/ManagerProtectedRoute';
import PermissionRoute from './components/PermissionRoute';
import ManagerLayout from './components/Manager/ManagerLayout';
import Unauthorized from './Pages/Unauthorized';

import { StreamingProvider } from "../src/components/LiveStreaming/StreamingContext";
import { AuthProvider } from './AuthContext';

import './App.css';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <AuthProvider>
      <StreamingProvider>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/manager/login" element={<Login />} />

          {/* ADMIN PROTECTED ROUTES */}
          <Route path="/*" element={
            <ProtectedRoute requiredRole="admin">
              <div className="app-wrapper">
                <Navbar
                  onHamburgerClick={() =>
                    setIsMobileOpen(!isMobileOpen)
                  }
                />
                <div className={`layout-body ${isCollapsed ? 'collapsed' : ''}`}>
                  <Sidebar
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                  />
                  <main className="main-content">
                    <div className="content-container">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/market-coins" element={<MarketCoins />} />
                        <Route path="/users/all" element={<AllUsers />} />
                        <Route path="/manager/create" element={<MakeManager />} />
                        <Route path="/reseller/create" element={<MakeReseller />} />
                        <Route path="/app-admin/create" element={<AppadminPage />} />
                        <Route path="/host/earnings" element={<AllEarnings />} />
                        <Route path="/host/history" element={<AllAgencyHistory />} /> 
                        <Route path="/app-admin/daily-bonus" element={<DailyBonusPage />} />  
                        <Route path="/app-settings" element={<AppSettingsPage />} />
                        <Route path="/posts" element={<Posts />} />
                        <Route path="/comments" element={<Comments />} />
                        <Route path="/banner-image" element={<BannerPage />} />
                        <Route path="/splash-banner" element={<SplashBannerPage />} />
                        <Route path="/live-bonus" element={<LiveBonusPage />} />
                        <Route path="/live-streaming" element={<LiveStreaming />} />
                        <Route path="/top-streams" element={<TopStreamsPage />} />
                        <Route path="/stories" element={<StoriesPage />} />  
                        <Route path="/gifts/all" element={<GiftsPage />} />
                        <Route path="/gifts/add-new" element={<AddNewGiftsPage />} />
                        <Route path="/vip/add" element={<AddNewAssetsPage />} /> 
                        <Route path="/avatar/add" element={<AddNewFramePage />} />
                        <Route path="/party-themes/add" element={<AddPartyThemesPage />} />
                        <Route path="/entrance-effects/add" element={<AddEntranceEffectPage />} />
                        <Route path="/announcements/all" element={<AllAnnouncementsPage />} />
                        <Route path="/announcements/add" element={<AddNewAnnouncementPage />} />
                        <Route path="/games-history" element={<GamesHistoryPage />} />
                        <Route path="/agora-settings" element={<AgoraPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/all-agencies" element={<AllAgency />} />
                        <Route path="/messages" element={<AllMessagesPage />} />
                        <Route path="/adminloginhistory" element={<AdminLoginHistoryPage />} />
                        <Route path="/banned-devices" element={<BannedDevicePage />} />
                        <Route path="/salary-queries" element={<SalaryQueryPage />} />
                        <Route path="/full-reports" element={<FullReportPage />} />
                        <Route path="/gift-history" element={<GiftHistoryPage />} />
                        <Route path="/coin-history" element={<CoinHistoryPage />} />
                        
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />

          {/* MANAGER PROTECTED ROUTES - WITH PERMISSION CHECKS */}
          <Route path="/manager/*" element={
            <ManagerProtectedRoute>
              <ManagerLayout />
            </ManagerProtectedRoute>
          }>
            {/* Always accessible */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            
            {/* Permission-protected routes */}
            <Route path="panels" element={
              <PermissionRoute requiredPermission="panels">
                <MakeManager />
              </PermissionRoute>
            } />
            
            <Route path="manager" element={
              <PermissionRoute requiredPermission="manager">
                <MakeManager />
              </PermissionRoute>
            } />
            
            <Route path="reseller" element={
              <PermissionRoute requiredPermission="reseller">
                <MakeReseller />
              </PermissionRoute>
            } />
            
            <Route path="users" element={
              <PermissionRoute requiredPermission="users">
                <AllUsers />
              </PermissionRoute>
            } />
            
            <Route path="app-admin" element={
              <PermissionRoute requiredPermission="app_admin">
                <AppadminPage />
              </PermissionRoute>
            } />
            
            <Route path="host-agency" element={
              <PermissionRoute requiredPermission="host_agency">
                <AllAgency />
              </PermissionRoute>
            } />
            
            <Route path="daily-bonus" element={
              <PermissionRoute requiredPermission="daily_bonus">
                <DailyBonusPage />
              </PermissionRoute>
            } />
            
            <Route path="live-bonus" element={
              <PermissionRoute requiredPermission="live_bonus">
                <LiveBonusPage />
              </PermissionRoute>
            } />
            
            <Route path="live-streams" element={
              <PermissionRoute requiredPermission="live_streams">
                <LiveStreaming />
              </PermissionRoute>
            } />
            
            <Route path="splash-banner" element={
              <PermissionRoute requiredPermission="splash_banner">
                <SplashBannerPage />
              </PermissionRoute>
            } />
            
            <Route path="banner-image" element={
              <PermissionRoute requiredPermission="banner_image">
                <BannerPage />
              </PermissionRoute>
            } />
            
            <Route path="messages" element={
              <PermissionRoute requiredPermission="messages">
                <AllMessagesPage />
              </PermissionRoute>
            } />
            
            <Route path="posts" element={
              <PermissionRoute requiredPermission="posts">
                <Posts />
              </PermissionRoute>
            } />
            
            <Route path="comments" element={
              <PermissionRoute requiredPermission="comments">
                <Comments />
              </PermissionRoute>
            } />
            
            <Route path="stories" element={
              <PermissionRoute requiredPermission="stories">
                <StoriesPage />
              </PermissionRoute>
            } />
            
            <Route path="official-announce" element={
              <PermissionRoute requiredPermission="official_announce">
                <AllAnnouncementsPage />
              </PermissionRoute>
            } />
            
            <Route path="gifts" element={
              <PermissionRoute requiredPermission="gifts">
                <GiftsPage />
              </PermissionRoute>
            } />
            
            <Route path="vip" element={
              <PermissionRoute requiredPermission="vip">
                <AddNewAssetsPage />
              </PermissionRoute>
            } />
            
            <Route path="avatar-frame" element={
              <PermissionRoute requiredPermission="avatar_frame">
                <AddNewFramePage />
              </PermissionRoute>
            } />
            
            <Route path="party-theme" element={
              <PermissionRoute requiredPermission="party_theme">
                <AddPartyThemesPage />
              </PermissionRoute>
            } />
            
            <Route path="entrance-effect" element={
              <PermissionRoute requiredPermission="entrance_effect">
                <AddEntranceEffectPage />
              </PermissionRoute>
            } />
            
            <Route path="salary-reports" element={
              <PermissionRoute requiredPermission="salary_reports">
                <SalaryQueryPage />
              </PermissionRoute>
            } />
            
            <Route path="top-streams" element={
              <PermissionRoute requiredPermission="top_streams">
                <TopStreamsPage />
              </PermissionRoute>
            } />
            
            <Route path="gift-coins-history" element={
              <PermissionRoute requiredPermission="gift_coins_history">
                <GiftHistoryPage />
              </PermissionRoute>
            } />
            
            <Route path="game-history" element={
              <PermissionRoute requiredPermission="game_history">
                <GamesHistoryPage />
              </PermissionRoute>
            } />
            
            <Route path="app-settings" element={
              <PermissionRoute requiredPermission="app_settings">
                <AppSettingsPage />
              </PermissionRoute>
            } />
            
            <Route path="report" element={
              <PermissionRoute requiredPermission="report">
                <ReportsPage />
              </PermissionRoute>
            } />
            
            <Route path="login-history" element={
              <PermissionRoute requiredPermission="login_history">
                <AdminLoginHistoryPage />
              </PermissionRoute>
            } />
            
            <Route path="users-device-ban" element={
              <PermissionRoute requiredPermission="users_device_ban">
                <BannedDevicePage />
              </PermissionRoute>
            } />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
          </Route>

          {/* Catch all for root level */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </StreamingProvider>
    </AuthProvider>
  );
}

export default App;
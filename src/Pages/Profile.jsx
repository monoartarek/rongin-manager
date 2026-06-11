import React, { useState, useEffect } from "react";
import Parse from "../parseConfig";
import { useNavigate } from "react-router-dom";
import { User, Lock, LogOut, ShieldCheck, Eye, EyeOff } from "lucide-react"; 
// Import handleManagerLogout from the correct file
import { handleManagerLogout } from "./Login"; 
import "./Profile.css";
import logo from "../../src/assets/logo.png"

function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await Parse.User.currentAsync();
        
        if (!user) {
          navigate("/manager/login");
          return;
        }
        
        // Check if user is a manager
        const role = user.get("role");
        if (role !== "manager") {
          await Parse.User.logOut();
          navigate("/manager/login");
          return;
        }
        
        setCurrentUser(user);
        
        // Load permissions from localStorage or fetch from Parse
        const storedPermissions = localStorage.getItem('managerPermissions');
        if (storedPermissions) {
          setPermissions(JSON.parse(storedPermissions));
        } else {
          // Fetch permissions from panels class
          const Panels = Parse.Object.extend("panels");
          const query = new Parse.Query(Panels);
          query.equalTo("username", user.get("username"));
          query.equalTo("role", "manager");
          
          const panelData = await query.first();
          if (panelData) {
            const perms = panelData.get("permissions") || [];
            setPermissions(perms);
            localStorage.setItem('managerPermissions', JSON.stringify(perms));
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        navigate("/manager/login");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [navigate]);

  const changeUsername = async () => {
    try {
      if(!username) return alert("Please enter a new username");
      
      // Update username in _User class
      const oldUsername = currentUser.get("username");
      currentUser.set("username", username);
      await currentUser.save();
      
      // Update username in panels class if exists
      const Panels = Parse.Object.extend("panels");
      const query = new Parse.Query(Panels);
      query.equalTo("username", oldUsername);
      query.equalTo("role", "manager");
      
      const panelData = await query.first();
      if (panelData) {
        panelData.set("username", username);
        await panelData.save();
      }
      
      alert("Username updated successfully! Please login again.");
      
      // Use the imported handleManagerLogout
      await handleManagerLogout(navigate);
      
    } catch (error) {
      alert("Error updating username: " + error.message);
    }
  };

  const changePassword = async () => {
    try {
      if(!password) return alert("Please enter a new password");
      
      if (password.length < 6) {
        return alert("Password must be at least 6 characters long");
      }
      
      currentUser.set("password", password);
      await currentUser.save();
      
      alert("Password updated successfully! Please login again with your new password.");
      setPassword("");
      
      // Use the imported handleManagerLogout
      await handleManagerLogout(navigate);
      
    } catch (error) {
      alert("Error updating password: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="pro-profile-viewport">
        <div className="pro-profile-card">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pro-profile-viewport">
      <div className="pro-profile-card">
        <div className="pro-profile-header">
          <div className="pro-avatar-wrapper">
          <div className="logo-container-3d">
            {/* <img src="https://priyulive.com/logo.png" alt="Logo" className="login-logo-3d" /> */}
            <img src={logo} alt="Profile" />
          </div>
             <div className="pro-online-badge"></div>
          </div>
          <h2>Manager Settings</h2>
          <p className="pro-user-email">
            {currentUser ? currentUser.get("username") : "Manager"}
          </p>
          <div className="pro-admin-tag">
            <ShieldCheck size={14} /> <span>Verified Manager</span>
          </div>
          
          {/* Show permission count */}
          {permissions.length > 0 && (
            <div className="permissions-info">
              <p>Access Permissions: {permissions.length} panels</p>
              <div className="permissions-preview">
                {permissions.slice(0, 3).map((perm, index) => (
                  <span key={index} className="permission-badge">
                    {perm.replace(/_/g, ' ')}
                  </span>
                ))}
                {permissions.length > 3 && (
                  <span className="permission-badge">+{permissions.length - 3} more</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="pro-profile-body">
          <div className="pro-input-section">
            <label>Change Username</label>
            <div className="pro-input-wrapper">
              <User className="pro-field-icon" size={18} />
              <input
                placeholder="New username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <button className="pro-action-btn" onClick={changeUsername}>
              Update Username
            </button>
            <p className="helper-text">
              ⚠️ Changing username will require re-login
            </p>
          </div>

          <div className="pro-divider"></div>

          {/* Password Section */}
          <div className="pro-input-section">
            <label>Security</label>
            <div className="pro-input-wrapper">
              <Lock className="pro-field-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                className="pro-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button className="pro-action-btn pro-secondary" onClick={changePassword}>
              Change Password
            </button>
            <p className="helper-text">
              ⚠️ Changing password will require re-login
            </p>
          </div>

          <div className="pro-divider"></div>

          {/* Account Info Section */}
          <div className="account-info-section">
            <h3>Account Information</h3>
            <div className="info-item">
              <span>Name:</span>
              <span>{currentUser?.get("name") || currentUser?.get("username")}</span>
            </div>
            <div className="info-item">
              <span>Email:</span>
              <span>{currentUser?.get("email") || "N/A"}</span>
            </div>
            <div className="info-item">
              <span>Role:</span>
              <span className="role-badge manager">Manager</span>
            </div>
            <div className="info-item">
              <span>Country:</span>
              <span>{currentUser?.get("country") || "N/A"}</span>
            </div>
          </div>

          <button 
            className="pro-logout-btn" 
            onClick={() => handleManagerLogout(navigate)}
          >
            <LogOut size={18} />
            <span>Logout Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
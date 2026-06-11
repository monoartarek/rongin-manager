// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Parse from "../parseConfig";
// import { saveLoginHistory } from "../utils/saveLoginHistory";
// import { Eye, EyeOff, ShieldAlert, Clock } from "lucide-react"; 
// import "./Login.css";
// import logo from "../../src/assets/logo.png"

// // Manager logout function - defined OUTSIDE the component for export
// export async function handleManagerLogout(navigate) {
//   try {
//     const user = Parse.User.current();
//     if (user) {
//       await saveLoginHistory(user, "logout");
//     }
//     await Parse.User.logOut();
//     localStorage.removeItem('managerPermissions');
    
//     if (navigate) {
//       navigate("/manager/login");
//     }
//   } catch (err) {
//     console.error("Logout error:", err.message);
//     await Parse.User.logOut();
//     localStorage.removeItem('managerPermissions');
//     if (navigate) {
//       navigate("/manager/login");
//     }
//   }
// }

// function ManagerLogin() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
  
//   // Security States
//   const [userIp, setUserIp] = useState("");
//   const [isLocked, setIsLocked] = useState(false);
//   const [attemptsLeft, setAttemptsLeft] = useState(5);

//   // Get IP and Check Security on Mount
//   useEffect(() => {
//     const initSecurity = async () => {
//       try {
//         const res = await fetch("https://api.ipify.org?format=json");
//         const data = await res.json();
//         setUserIp(data.ip);
//         checkSecurityStatus(data.ip);
//       } catch (err) {
//         console.error("IP Verification failed");
//       }
//     };
//     initSecurity();
//   }, []);

//   // Check if manager is already logged in
//   useEffect(() => {
//     const checkCurrentUser = async () => {
//       const currentUser = Parse.User.current();
//       if (currentUser) {
//         const role = currentUser.get("role");
//         if (role === "manager") {
//           navigate("/manager/dashboard/");
//         }
//       }
//     };
//     checkCurrentUser();
//   }, [navigate]);

//   const checkSecurityStatus = async (ip) => {
//     const query = new Parse.Query("SecurityLogs");
//     query.equalTo("deviceIp", ip);
//     const log = await query.first();

//     if (log) {
//       const attempts = log.get("attempts") || 0;
//       const lastAttempt = log.get("updatedAt");
//       const now = new Date();
      
//       // 24 Hours in milliseconds
//       const cooldown = 24 * 60 * 60 * 1000;

//       if (attempts >= 5) {
//         if (now - lastAttempt < cooldown) {
//           setIsLocked(true);
//         } else {
//           // Cooldown finished: Auto-unban
//           await log.destroy();
//           setIsLocked(false);
//           setAttemptsLeft(5);
//         }
//       } else {
//         setAttemptsLeft(5 - attempts);
//       }
//     }
//   };

//   const recordFailure = async () => {
//     const query = new Parse.Query("SecurityLogs");
//     query.equalTo("deviceIp", userIp);
//     let log = await query.first();

//     if (!log) {
//       const SecurityLogs = Parse.Object.extend("SecurityLogs");
//       log = new SecurityLogs();
//       log.set("deviceIp", userIp);
//       log.set("attempts", 0);
//       log.set("isBanned", false);
//     }

//     const newAttempts = (log.get("attempts") || 0) + 1;
//     log.set("attempts", newAttempts);
//     await log.save();

//     setAttemptsLeft(5 - newAttempts);
//     if (newAttempts >= 5) setIsLocked(true);
//   };

//   const handleLogin = async () => {
//     if (!username || !password || isLocked) return;
//     setLoading(true);

//     try {
//       // Step 1: Login with Parse
//       const user = await Parse.User.logIn(username, password);
//       const userRole = user.get("role");

//       // Step 2: Check if user is a manager
//       if (userRole !== "manager") {
//         await saveLoginHistory(user, "failed");
//         await Parse.User.logOut();
//         alert("Access denied! Only managers can login here.");
//         setLoading(false);
//         return;
//       }

//       // Step 3: Check if manager has permissions in panels class
//       const Panels = Parse.Object.extend("panels");
//       const query = new Parse.Query(Panels);
//       query.equalTo("username", username);
//       query.equalTo("role", "manager");
      
//       const panelData = await query.first();
      
//       if (!panelData) {
//         await saveLoginHistory(user, "failed");
//         await Parse.User.logOut();
//         alert("No permissions assigned to your account. Please contact the administrator.");
//         setLoading(false);
//         return;
//       }

//       const permissions = panelData.get("permissions") || [];
      
//       if (permissions.length === 0) {
//         await saveLoginHistory(user, "failed");
//         await Parse.User.logOut();
//         alert("Your account has no permissions. Please contact the administrator.");
//         setLoading(false);
//         return;
//       }

//       // Step 4: Success - Clear security logs for this IP
//       const securityQuery = new Parse.Query("SecurityLogs");
//       securityQuery.equalTo("deviceIp", userIp);
//       const securityLog = await securityQuery.first();
//       if (securityLog) await securityLog.destroy();

//       // Save login history
//       await saveLoginHistory(user, "login");
      
//       // Store permissions in localStorage for quick access
//       localStorage.setItem('managerPermissions', JSON.stringify(permissions));
      
//       // Redirect to manager dashboard
//       navigate("/manager/dashboard");
      
//     } catch (error) {
//       await recordFailure();
//       await saveLoginHistory(null, "failed", username);
      
//       // More specific error messages
//       if (error.code === 101) {
//         alert("Invalid username or password");
//       } else if (error.code === 209) {
//         alert("Session expired. Please try again.");
//       } else {
//         alert(error.message || "Login failed. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- BANNED UI STATE ---
//   if (isLocked) {
//     return (
//       <div className="login-container">
//         <div className="login-card-3d banned-card">
//           <div className="banned-content">
//             <div className="banned-icon-wrapper">
//               <ShieldAlert size={50} color="#ff4d4f" />
//             </div>
//             <h2>Access Restricted</h2>
//             <p>Too many failed attempts from this device.</p>
//             <div className="ip-badge">{userIp}</div>
//             <div className="cooldown-timer">
//               <Clock size={16} />
//               <span>Blocked for 24 Hours</span>
//             </div>
//             <p className="footer-note">Contact system administrator if this is an error.</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="login-container">
//       <div className="shape shape-1"></div>
//       <div className="shape shape-2"></div>

//       <div className="login-card-3d">
//         <div className="login-header-3d">
//           <div className="logo-container-3d">
//             <img src={logo} alt="Profile" />
//           </div>

//         </div>

//         <div className="login-body-3d">
//           <h2>Manager Login</h2>
//           <p className="subtitle">Manager Authentication Required</p>

//           <div className="input-group-3d">
//             <input
//               type="text"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               disabled={loading}
//               className="neumorphic-input"
//             />
//           </div>

//           <div className="input-group-3d password-wrapper-3d neumorphic-input">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               disabled={loading}
//               onKeyDown={(e) => e.key === "Enter" && handleLogin()}
//               className="password-inner-input"
//             />
//             <button 
//               type="button" 
//               className="toggle-password-3d"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <EyeOff size={20} color="#777" /> : <Eye size={20} color="#777" />}
//             </button>
//           </div>

//           {attemptsLeft < 5 && (
//             <p className="attempts-warning">
//               ⚠️ Warning: {attemptsLeft} attempts remaining before IP block.
//             </p>
//           )}

//           <button 
//             className={`login-submit-btn-3d ${loading ? 'loading' : ''}`} 
//             onClick={handleLogin} 
//             disabled={loading}
//           >
//             {loading ? "Verifying..." : "Log In as Manager"}
//           </button>

//           <div className="login-footer-3d">
//             <p>🔒 Security Monitoring Enabled</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// export default ManagerLogin;

















import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Parse from "../parseConfig";
import { saveLoginHistory } from "../utils/saveLoginHistory";
import { Eye, EyeOff, ShieldAlert, Clock } from "lucide-react"; 
import "./Login.css";
import logo from "../../src/assets/logo.png";

// Manager logout function - defined OUTSIDE the component for export
export async function handleManagerLogout(navigate) {
  try {
    const user = Parse.User.current();
    if (user) {
      await saveLoginHistory(user, "logout");
    }
    await Parse.User.logOut();
    localStorage.removeItem('managerPermissions');
    
    if (navigate) {
      navigate("/manager/login");
    }
  } catch (err) {
    console.error("Logout error:", err.message);
    await Parse.User.logOut();
    localStorage.removeItem('managerPermissions');
    if (navigate) {
      navigate("/manager/login");
    }
  }
}

function ManagerLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Security States
  const [userIp, setUserIp] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  
  // Use ref to prevent infinite loop
  const hasChecked = useRef(false);

  // Get IP and Check Security on Mount
  useEffect(() => {
    const initSecurity = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setUserIp(data.ip);
        checkSecurityStatus(data.ip);
      } catch (err) {
        console.error("IP Verification failed");
      }
    };
    initSecurity();
  }, []);

  // Check if manager is already logged in - RUN ONLY ONCE
  useEffect(() => {
    if (hasChecked.current) return; // PREVENT INFINITE LOOP
    
    const checkCurrentUser = async () => {
      hasChecked.current = true;
      const currentUser = Parse.User.current();
      if (currentUser) {
        const role = currentUser.get("role");
        if (role === "manager") {
          // Use replace to avoid history stack issues
          navigate("/manager/dashboard", { replace: true });
        }
      }
    };
    checkCurrentUser();
  }, []); // Empty dependency array - run only once

  const checkSecurityStatus = async (ip) => {
    try {
      const query = new Parse.Query("SecurityLogs");
      query.equalTo("deviceIp", ip);
      const log = await query.first();

      if (log) {
        const attempts = log.get("attempts") || 0;
        const lastAttempt = log.get("updatedAt");
        const now = new Date();
        
        const cooldown = 24 * 60 * 60 * 1000;

        if (attempts >= 5) {
          if (now - lastAttempt < cooldown) {
            setIsLocked(true);
          } else {
            await log.destroy();
            setIsLocked(false);
            setAttemptsLeft(5);
          }
        } else {
          setAttemptsLeft(5 - attempts);
        }
      }
    } catch (err) {
      console.error("Security check error:", err);
    }
  };

  const recordFailure = async () => {
    try {
      const query = new Parse.Query("SecurityLogs");
      query.equalTo("deviceIp", userIp);
      let log = await query.first();

      if (!log) {
        const SecurityLogs = Parse.Object.extend("SecurityLogs");
        log = new SecurityLogs();
        log.set("deviceIp", userIp);
        log.set("attempts", 0);
        log.set("isBanned", false);
      }

      const newAttempts = (log.get("attempts") || 0) + 1;
      log.set("attempts", newAttempts);
      await log.save();

      setAttemptsLeft(5 - newAttempts);
      if (newAttempts >= 5) setIsLocked(true);
    } catch (err) {
      console.error("Record failure error:", err);
    }
  };

  const handleLogin = async () => {
    if (!username || !password || isLocked) return;
    setLoading(true);

    try {
      // Step 1: Login with Parse
      const user = await Parse.User.logIn(username, password);
      const userRole = user.get("role");

      // Step 2: Check if user is a manager
      if (userRole !== "manager") {
        await saveLoginHistory(user, "failed");
        await Parse.User.logOut();
        alert("Access denied! Only managers can login here.");
        setLoading(false);
        return;
      }

      // Step 3: Check if manager has permissions in panels class
      const Panels = Parse.Object.extend("panels");
      const query = new Parse.Query(Panels);
      query.equalTo("username", username);
      query.equalTo("role", "manager");
      
      const panelData = await query.first();
      
      if (!panelData) {
        await saveLoginHistory(user, "failed");
        await Parse.User.logOut();
        alert("No permissions assigned to your account. Please contact the administrator.");
        setLoading(false);
        return;
      }

      const permissions = panelData.get("permissions") || [];
      
      if (permissions.length === 0) {
        await saveLoginHistory(user, "failed");
        await Parse.User.logOut();
        alert("Your account has no permissions. Please contact the administrator.");
        setLoading(false);
        return;
      }

      // Step 4: Success - Clear security logs for this IP
      try {
        const securityQuery = new Parse.Query("SecurityLogs");
        securityQuery.equalTo("deviceIp", userIp);
        const securityLog = await securityQuery.first();
        if (securityLog) await securityLog.destroy();
      } catch (err) {
        console.error("Error clearing security logs:", err);
      }

      // Save login history
      await saveLoginHistory(user, "login");
      
      // Store permissions in localStorage for quick access
      localStorage.setItem('managerPermissions', JSON.stringify(permissions));
      
      // FIX: Use window.location for hard redirect to prevent issues
      window.location.href = "/manager/dashboard";
      
    } catch (error) {
      await recordFailure();
      
      try {
        await saveLoginHistory(null, "failed", username);
      } catch (err) {
        console.error("Error saving login history:", err);
      }
      
      if (error.code === 101) {
        alert("Invalid username or password");
      } else if (error.code === 209) {
        alert("Session expired. Please try again.");
      } else {
        alert(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- BANNED UI STATE ---
  if (isLocked) {
    return (
      <div className="login-container">
        <div className="login-card-3d banned-card">
          <div className="banned-content">
            <div className="banned-icon-wrapper">
              <ShieldAlert size={50} color="#ff4d4f" />
            </div>
            <h2>Access Restricted</h2>
            <p>Too many failed attempts from this device.</p>
            <div className="ip-badge">{userIp}</div>
            <div className="cooldown-timer">
              <Clock size={16} />
              <span>Blocked for 24 Hours</span>
            </div>
            <p className="footer-note">Contact system administrator if this is an error.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>

      <div className="login-card-3d">
        <div className="login-header-3d">
          <div className="logo-container-3d">
            <img src={logo} alt="Logo" className="login-logo-3d" />
          </div>
        </div>

        <div className="login-body-3d">
          <h2>Manager Login</h2>
          <p className="subtitle">Manager Authentication Required</p>

          <div className="input-group-3d">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="neumorphic-input"
            />
          </div>

          <div className="input-group-3d password-wrapper-3d neumorphic-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="password-inner-input"
            />
            <button 
              type="button" 
              className="toggle-password-3d"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} color="#777" /> : <Eye size={20} color="#777" />}
            </button>
          </div>

          {attemptsLeft < 5 && (
            <p className="attempts-warning">
              ⚠️ Warning: {attemptsLeft} attempts remaining before IP block.
            </p>
          )}

          <button 
            className={`login-submit-btn-3d ${loading ? 'loading' : ''}`} 
            onClick={handleLogin} 
            disabled={loading}
          >
            {loading ? "Verifying..." : "Log In as Manager"}
          </button>

          <div className="login-footer-3d">
            <p>🔒 Security Monitoring Enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerLogin;
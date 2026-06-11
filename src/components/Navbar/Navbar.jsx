import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Parse from "../../parseConfig";
import { Menu, X, LayoutDashboard, Terminal, LogOut } from "lucide-react";
import { useAuth } from "../../AuthContext";
import "./Navbar.css";
import logo from "../../../public/logo.png"

function ManagerNavbar({ onHamburgerClick }) {
  const [user, setUser] = useState(null);
  const [visitedHistory, setVisitedHistory] = useState([]);
  const [liveStats, setLiveStats] = useState([
    { type: "audio", count: 0 },
    { type: "video", count: 0 },
    { type: "multi", count: 0 },
  ]);
  const [statIndex, setStatIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);
  const { permissions, logout } = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await Parse.User.currentAsync();
      if (currentUser) {
        if (currentUser.get("role") !== "manager") {
          await logout();
          navigate("/manager/login");
          return;
        }
        setUser(currentUser);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!permissions.includes("live_streams")) return;

    const fetchStats = async () => {
      try {
        const query = new Parse.Query("Streaming");
        query.equalTo("streaming", true);
        query.limit(1000);
        const results = await query.find();

        const counts = { audio: 0, video: 0, multi: 0 };
        results.forEach((row) => {
          const type = row.get("liveType");
          if (type === "audio") counts.audio++;
          else if (type === "video") counts.video++;
          else if (type === "multi") counts.multi++;
        });

        setLiveStats([
          { type: "audio", count: counts.audio },
          { type: "video", count: counts.video },
          { type: "multi", count: counts.multi },
        ]);
      } catch (err) {
        console.error("Failed to fetch live stats:", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [permissions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStatIndex((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [visitedHistory, location.pathname]);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/manager/dashboard" || path === "/manager/login") return;

    setVisitedHistory((prev) => {
      if (prev.find((item) => item.path === path)) return prev;
      const pathParts = path.replace("/manager/", "").split("-");
      const name = pathParts
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return [...prev, { name, path }];
    });
  }, [location]);

  const removeHistoryItem = (e, pathToRemove) => {
    e.stopPropagation();
    setVisitedHistory((prev) => prev.filter((item) => item.path !== pathToRemove));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/manager/login");
  };

  const current = liveStats[statIndex];

  return (
    <nav className="manager-nav-container">
      <div className="manager-nav-left-group">
        {/* Hamburger Menu Button - Visible only on mobile */}
        <button 
          className="manager-nav-mobile-toggle" 
          onClick={onHamburgerClick}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="manager-nav-brand-box" onClick={() => navigate("/manager/dashboard")}>
          <div className="manager-brand-icon">
            <Terminal size={18} color="#fff" />
          </div>
          <div className="manager-brand-text">
            <span className="brand-main">Rongin</span>
            <span className="brand-sub">Manager</span>
          </div>
        </div>

        {visitedHistory.length > 0 && (
          <div className="manager-nav-history-viewport" ref={scrollRef}>
            {visitedHistory.map((item) => (
              <div
                key={item.path}
                className={`manager-history-tab ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <LayoutDashboard size={12} className="tab-icon" />
                <span>{item.name}</span>
                <X
                  size={12}
                  className="tab-close"
                  onClick={(e) => removeHistoryItem(e, item.path)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="manager-nav-right-group">
        {permissions.includes("live_streams") && (
          <div
            key={current.type}
            className={`manager-stat-carousel ${current.type}`}
            onClick={() => navigate("/manager/live-streams")}
            style={{ cursor: "pointer" }}
          >
            <span className="stat-dot" />
            <span className="stat-label">{current.type}</span>
            <span className="stat-count">{current.count}</span>
            <span className="stat-suffix">live</span>
          </div>
        )}

        {user && (
          <div className="manager-nav-profile-pill" onClick={() => navigate("/manager/profile")}>
            <div className="manager-nav-user-info">
              <p className="manager-nav-username">{user.get("name") || user.getUsername()}</p>
              <p className="manager-nav-role">Manager</p>
            </div>
            <div className="manager-nav-avatar-box">
             



            
            <img src={logo} alt="Profile" />
         






              <div className="manager-nav-status-dot"></div>
            </div>
          </div>
        )}

        {/* Desktop logout button - hidden on mobile */}
        <button className="manager-nav-logout-btn desktop-only" onClick={handleLogout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}

export default ManagerNavbar;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./header";
import Sidebar from "./Sidebar";

const colors = {
  background: '#0F0E17',
  mainBackground: '#1A1A2E',
  textPrimary: '#00FFAB',
  danger: '#FF005C',
  success: '#00FF9F',
};

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const menuItems = [
    { icon: "➕", label: "Create Orders", href: "/create-order" },
    { icon: "👁️", label: "View Orders", href: "/orders" },
    { icon: "📖", label: "Add Ledger", href: "/ledger" },
    { icon: "👤", label: "Customer", href: "/customers" },
    { icon: "📊", label: "View Ledger", href: "/view-ledger" },
  ];

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    const token = localStorage.getItem("token");

    try {
      if (token) {
        await fetch( `${import.meta.env.VITE_BACKEND_URL}/api/customers/log-activity-save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: "logout",
            details: {},
          }),
        });
      }
    } catch (err) {
      console.error("Logout activity logging failed:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("staff");
    navigate("/", { replace: true });
    window.location.reload();
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // handleLogout is already defined above

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(rgba(15,14,23,0.9), rgba(15,14,23,0.9)), url('/images/bg-cyberpunk.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: colors.textPrimary,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: isMobile ? 'flex-end' : 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          backgroundColor: '#161B22',
          borderBottom: '1px solid #222',
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}
      >
        {!isMobile && (
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.textPrimary }}>
            GameZone
          </div>
        )}

        {isMobile && (
          <button
            onClick={toggleMobileMenu}
            style={{
              background: 'none',
              border: 'none',
              color: colors.textPrimary,
              fontSize: '28px',
              cursor: 'pointer',
            }}
          >
            ☰
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <div className="menu-header">
              <h5 className="menu-logo">Gamer Squad</h5>
            </div>

            <div className="menu-divider" />

            <nav className="menu-nav">
              {menuItems.map((item, idx) => (
                <Link 
                  key={idx} 
                  to={item.href} 
                  className="menu-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                </Link>
              ))}

              <button onClick={handleLogout} className="menu-item logout-btn">
                <span className="menu-icon">🚪</span>
                <span className="menu-label">Logout</span>
              </button>
            </nav>
          </div>

          <style>{`
            .mobile-menu {
              position: fixed;
              top: 60px;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: #1e293b;
              z-index: 1000;
              overflow-y: auto;
            }

            .mobile-menu-content {
              padding: 1.5rem;
            }

            .menu-header {
              margin-bottom: 2rem;
              text-align: center;
            }

            .menu-logo {
              color: #22c55e;
              font-weight: bold;
              font-size: 1.8rem;
              margin: 0;
            }

            .menu-divider {
              height: 1px;
              background-color: #334155;
              margin-bottom: 1.5rem;
              width: 100%;
            }

            .menu-nav {
              display: flex;
              flex-direction: column;
              gap: 1rem;
            }

            .menu-item {
              display: flex;
              align-items: center;
              gap: 1rem;
              color: white;
              text-decoration: none;
              padding: 0.75rem;
              border-radius: 5px;
              transition: all 0.3s ease;
              font-size: 1.1rem;
            }

            .menu-item:hover {
              background-color: #334155;
              color: #22c55e;
            }

            .menu-icon {
              font-size: 1.3rem;
            }

            .menu-label {
              font-weight: 500;
            }

            .logout-btn {
              background: none;
              border: none;
              width: 100%;
              text-align: left;
              color: ${colors.danger};
            }

            .logout-btn:hover {
              background-color: ${colors.danger}22;
              color: white;
            }
          `}</style>
        </div>
      )}

      {/* Desktop Layout */}
      {!isMobile && (
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main
            style={{
              marginLeft: '220px',
              flexGrow: 1,
              backgroundColor: colors.mainBackground,
              color: '#fff',
              padding: '20px',
              boxSizing: 'border-box',
              minHeight: '100vh',
              overflowY: 'auto',
            }}
          >
            {children}
          </main>
        </div>
      )}

      {/* Mobile Content (Only when menu is closed) */}
      {isMobile && !isMobileMenuOpen && (
        <main
          style={{
            backgroundColor: colors.mainBackground,
            color: '#fff',
            padding: '20px',
            boxSizing: 'border-box',
            minHeight: '100vh',
          }}
        >
          {children}
        </main>
      )}
    </div>
  );
};

const menuLinkStyle = {
  textDecoration: 'none',
  color: '#FFD700',
  fontSize: '20px',
  fontWeight: 'bold',
  padding: '10px 0',
  borderBottom: '1px solid #333',
};

export default Layout;

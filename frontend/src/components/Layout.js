import { BarChart3, Menu, Moon, PlusCircle, Sun, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

const Layout = () => {
  const { logout, user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("crmTheme") === "dark");

  useEffect(() => {
    document.body.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("crmTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="app-shell">
      <aside className="sidebar offcanvas-lg offcanvas-start" tabIndex="-1" id="crmSidebar">
        <div className="sidebar-header">
          <Link to="/" className="brand">
            <span className="brand-mark">LF</span>
            <span>LeadFlow CRM</span>
          </Link>
          <span className="text-muted small">Mini CRM</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end>
            <BarChart3 size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/leads">
            <Users size={18} />
            <span>Leads</span>
          </NavLink>
          <NavLink to="/leads/new">
            <PlusCircle size={18} />
            <span>Add Lead</span>
          </NavLink>
        </nav>
      </aside>

      <div className="main-panel">
        <nav className="topbar navbar navbar-expand bg-body border-bottom">
          <div className="container-fluid">
            <button
              className="btn btn-outline-secondary d-lg-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#crmSidebar"
              aria-controls="crmSidebar"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="topbar-title d-none d-md-block">
              <strong>Client Lead Workspace</strong>
              <span>Manage prospects, follow-ups and conversions</span>
            </div>
            <div className="ms-auto d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-secondary icon-btn"
                onClick={() => setDarkMode((value) => !value)}
                type="button"
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <span className="user-pill d-none d-sm-inline-flex">{user?.email}</span>
              <button className="btn btn-primary" onClick={logout} type="button">
                Logout
              </button>
            </div>
          </div>
        </nav>
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

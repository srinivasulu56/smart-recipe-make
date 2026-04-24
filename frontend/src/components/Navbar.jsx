import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: "rgba(var(--bg-raw, 15,14,12),0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      padding: "0 32px",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
      backgroundColor: "var(--bg2)",
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "22px" }}>🍲</span>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "20px",
          color: "var(--accent)",
          fontWeight: 700,
        }}>Smart Recipe Maker</span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {token && (
          <>
            <NavLink to="/" label="Dashboard" active={isActive("/")} />
            <NavLink to="/favorites" label="Favorites" active={isActive("/favorites")} />
          </>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Dark/Light Toggle */}
        <button onClick={() => setDark(!dark)} style={{
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "6px 12px",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--text2)",
          transition: "all 0.2s",
        }}>
          {dark ? "☀️" : "🌙"}
        </button>

        {token ? (
          <>
            <span style={{ color: "var(--text2)", fontSize: "14px" }}>
              Hi, <span style={{ color: "var(--accent)" }}>{username || "Chef"}</span>
            </span>
            <button onClick={logout} style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text2)",
              padding: "7px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              transition: "all 0.2s",
            }}
            onMouseOver={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.color = "var(--accent)"; }}
            onMouseOut={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text2)"; }}
            >Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              color: "var(--text2)", fontSize: "14px", padding: "7px 16px",
              borderRadius: "8px", border: "1px solid var(--border)",
            }}>Login</Link>
            <Link to="/register" style={{
              background: "var(--accent)", color: "#0f0e0c",
              fontSize: "14px", padding: "7px 16px",
              borderRadius: "8px", fontWeight: 600,
            }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, label, active }) {
  return (
    <Link to={to} style={{
      color: active ? "var(--accent)" : "var(--text2)",
      fontSize: "14px",
      padding: "6px 14px",
      borderRadius: "8px",
      background: active ? "var(--accent-glow)" : "transparent",
      fontWeight: active ? 600 : 400,
      transition: "all 0.2s",
    }}>{label}</Link>
  );
}

export default Navbar;
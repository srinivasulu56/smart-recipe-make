import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login/", { username, password });
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("username", username);
      navigate("/");
    } catch {
      setError("Invalid username or password");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(ellipse at 50% 0%, rgba(232,160,69,0.07) 0%, transparent 60%)",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        padding: "48px",
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        animation: "fadeUp 0.4s ease",
      }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🍳</div>
          <h2 style={{ fontSize: "28px", color: "var(--text)", marginBottom: "8px" }}>Welcome back</h2>
          <p style={{ color: "var(--text2)", fontSize: "14px" }}>Sign in to your kitchen</p>
        </div>

        {error && (
          <div style={{
            background: "rgba(224,92,92,0.1)",
            border: "1px solid rgba(224,92,92,0.3)",
            color: "var(--red)",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "14px",
            marginBottom: "20px",
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", color: "var(--text2)", fontSize: "13px", marginBottom: "8px" }}>Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="your_username"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text2)", fontSize: "13px", marginBottom: "8px" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            background: loading ? "var(--bg3)" : "var(--accent)",
            color: loading ? "var(--text2)" : "#0f0e0c",
            border: "none",
            padding: "14px",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: 600,
            marginTop: "8px",
            transition: "all 0.2s",
          }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", color: "var(--text2)", fontSize: "14px" }}>
          No account?{" "}
          <Link to="/register" style={{ color: "var(--accent)" }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "var(--bg2)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  padding: "12px 16px",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
};

export default Login;
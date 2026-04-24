import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/register/", { username, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
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
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>👨‍🍳</div>
          <h2 style={{ fontSize: "28px", color: "var(--text)", marginBottom: "8px" }}>Create account</h2>
          <p style={{ color: "var(--text2)", fontSize: "14px" }}>Join and start cooking smarter</p>
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
            <label style={{ display: "block", color: "var(--text2)", fontSize: "13px", marginBottom: "8px" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
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
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", color: "var(--text2)", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)" }}>Sign in</Link>
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

export default Register;
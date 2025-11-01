import React, { useState } from "react";
import logo from "../assets/Avilox/logo.png";
import { useNavigate } from "react-router-dom";
import adminAuthService from "../services/admin.auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    console.log("Attempting login with:", { email, password: "***" });

    try {
      setLoading(true);
      console.log("Calling adminAuthService.login...");
      const response = await adminAuthService.login(email, password);
      console.log("Login successful:", response);
      
      // Navigate to home on success
      console.log("Navigating to home page...");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error details:", {
        message: err.message,
        stack: err.stack
      });
      if (err.message.includes('Network Error') || err.message.includes('Failed to fetch')) {
        setError("Cannot connect to server. Please make sure the backend is running on port 9000.");
      } else {
        setError(err.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.login}>
        <img src={logo} alt="Logo" style={styles.logo}/>
        <div style={styles.input}>
          <h1 style={styles.label}>Enter Email Address</h1>
          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon}>📧</span>
            <input 
              type="email" 
              placeholder="Enter Email Address" 
              style={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <h1 style={styles.label}>Enter Password</h1>
          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon}>🔒</span>
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password" 
              style={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLogin(e);
                }
              }}
            />
            <span
              role="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              style={styles.toggleIcon}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}
          <button 
            onClick={handleLogin} 
            style={{...styles.button, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'}}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  )
    
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  login: {
    width: "370px",
    margin: "auto",
    padding: "48px 32px 32px 32px",
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1.5px solid #e5e7eb",
    zIndex: 1
  },
  logo: {
    width: "90px",
    marginBottom: "28px",
    borderRadius: "50%",
  },
  input: {
    width: "100%",
    marginBottom: "18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  label: {
    fontSize: "1.08rem",
    margin: "10px 0 6px 0",
    color: "#22223b",
    fontWeight: 600,
    alignSelf: "flex-start"
  },
  inputWrapper: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    background: "#f3f4f6",
    borderRadius: "7px",
    border: "1px solid #e5e7eb",
    marginBottom: "14px",
    padding: "0 10px"
  },
  inputIcon: {
    fontSize: "1.1rem",
    color: "#64748b",
    marginRight: "8px"
  },
  inputField: {
    flex: 1,
    padding: "11px 8px",
    border: "none",
    borderRadius: "7px",
    fontSize: "1rem",
    outline: "none",
    background: "transparent",
    transition: "box-shadow 0.2s, border 0.2s"
  },
  toggleIcon: {
    fontSize: "1.05rem",
    color: "#64748b",
    marginLeft: "8px",
    cursor: "pointer",
    userSelect: "none"
  },
  button: {
    width: "100%",
    padding: "13px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    fontSize: "1.13rem",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "8px",
    marginBottom: "8px",
    boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
    transition: "background 0.2s, transform 0.2s"
  },
  errorMessage: {
    color: "#dc3545",
    fontSize: "0.9rem",
    marginTop: "8px",
    padding: "8px",
    background: "#f8d7da",
    borderRadius: "6px",
    border: "1px solid #f5c2c7",
    width: "100%",
    textAlign: "center"
  }
};

export default Login;



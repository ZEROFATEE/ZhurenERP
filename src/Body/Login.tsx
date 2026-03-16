// src/pages/login.tsx
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Optional: Set a fake auth token if you're using ProtectedRoutes
    localStorage.setItem("authToken", "fake-token");
    
    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f5f5f5"
    }}>
      <div style={{
        padding: "40px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        <h1 style={{ marginBottom: "20px" }}>Welcome</h1>
        <p style={{ marginBottom: "30px", color: "#666" }}>
          Click below to enter the dashboard
        </p>
        
        <button
          onClick={handleLogin}
          style={{
            padding: "12px 32px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0056b3";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#007bff";
          }}
        >
          Enter Dashboard
        </button>
      </div>
    </div>
  );
}
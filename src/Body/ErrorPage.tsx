// src/pages/home.tsx
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <p>Select an option from the sidebar or click below:</p>
      
      <button onClick={() => navigate("/sales")}>
        Go to Sales
      </button>
      <button onClick={() => navigate("/members")}>
        View Members
      </button>
    </div>
  );
}
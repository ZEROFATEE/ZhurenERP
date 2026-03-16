// src/pages/home.tsx
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/appsidebar";

export default function Sales() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Sales TAB</h1>
      <p>Stocks and inventory go brrrrr</p>
      

    </div>
  );
}
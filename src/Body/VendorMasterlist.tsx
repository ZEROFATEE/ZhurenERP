// src/pages/home.tsx
import { useNavigate } from "react-router-dom";
import CustomerList from "@/components/CustomerList";

export default function VendorMasterlist() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Vendor Masterlist</h1>
    </div>
  );
}
// src/pages/home.tsx
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/appsidebar";
import SalesList from "../components/SalesList"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Search } from "lucide-react"


export default function Sales() {
 

  return (
    <div className="p-4 flex flex-col gap-4">
             <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end"></InputGroupAddon>
    </InputGroup>

      <SalesList />
    </div>
  );
}
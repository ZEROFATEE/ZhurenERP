import { useNavigate } from "react-router-dom";
import CustomerList from "@/components/CustomerList";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Search } from "lucide-react"

export default function Purchases() {
 {/* const navigate = useNavigate(); */}

  return (
    <div className="p-4 flex flex-col gap-4">
      
       <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end"></InputGroupAddon>
    </InputGroup>
      <CustomerList />
    </div>
  );
}
// src/pages/home.tsx
import { useNavigate } from "react-router-dom";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react"
import Vendorlist from "@/components/VendorList";

export default function VendorMasterlist() {
  const navigate = useNavigate();

  return (
    <div>
       <div className="p-10 flex flex-col gap-6">

        {/* Vendor Info Form */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
          
          <div className="flex items-center gap-2">
            <label className="w-36 text-sm font-medium shrink-0">Vendor</label>
            <input className="border rounded px-2 py-1 text-sm w-full" placeholder=""/>
          </div>

          <div className="flex items-center gap-2">
            <label className="w-36 text-sm font-medium shrink-0">Contact #</label>
            <input className="border rounded px-2 py-1 text-sm w-full" placeholder=""/>
          </div>

          <div className="flex items-center gap-2">
            <label className="w-36 text-sm font-medium shrink-0">Mailing Address</label>
            <input className="border rounded px-2 py-1 text-sm w-full" placeholder=""/>
          </div>

          <div className="flex items-center gap-2">
            <label className="w-36 text-sm font-medium shrink-0">Account #</label>
            <input className="border rounded px-2 py-1 text-sm w-full" placeholder=""/>
          </div>

          <div className="flex items-center gap-2">
            <label className="w-36 text-sm font-medium shrink-0">Email</label>
            <input className="border rounded px-2 py-1 text-sm w-full" placeholder=""/>
          </div>

        </div>
    
    <div className="p-10 flex flex-col gap-3 max-w-7xl">
     <InputGroup className="max-w-xs">
     <InputGroupInput placeholder="Search..."/>
     <InputGroupAddon>
     <Search />
     </InputGroupAddon>
     <InputGroupAddon align="inline-end"></InputGroupAddon> 
    </InputGroup>

    <Vendorlist/>
    </div>
    </div>
    </div>
  );
}
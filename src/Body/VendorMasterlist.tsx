import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react"
import Vendorlist from "@/components/VendorList";
import Vendoraddtab from "@/components/Vendoraddtab";

const vendorList = [
  { id: 1, date: "2/2/2026", description: "Office Supplies", quantity: 67, amount: 1250.00, status: "Paid"},
  { id: 2, date: "2/3/2026", description: "IT Equipment", quantity: 12, amount: 8500.00, status: "Pending"},
  { id: 3, date: "2/4/2026", description: "Furniture", quantity: 5, amount: 3200.00, status: "Cancelled"},
]

export default function VendorMasterlist() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <Vendoraddtab 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-black">Vendors</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold text-black bg-gray-200 rounded-full">
              {vendorList.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>
        </div>

        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
          <Input 
            placeholder="Search vendors..." 
            className="pl-10 pr-3 py-2 h-10 text-sm text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg placeholder:text-gray-500"
          />
        </div>

        <Vendorlist/>
      </div>
    </div>
  );
}
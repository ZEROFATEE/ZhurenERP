import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react"
import Vendorlist from "@/components/VendorList";
import Vendoraddtab from "@/components/Vendoraddtab";
import Vendordetailtab from "@/components/Vendordetailtab";

type VendorlistType = {
  id: number
  name: string
  dateReceived: string
  shippingDate: string
  amount: number
}

const vendorList: VendorlistType[] = [
  { id: 1, name: "Porter Robinson", dateReceived: "2/1/2026", shippingDate: "2/5/2026", amount: 1250.00 },
  { id: 2, name: "Hikaru Utada", dateReceived: "2/2/2026", shippingDate: "2/6/2026", amount: 8500.00 },
  { id: 3, name: "Kanye West", dateReceived: "2/3/2026", shippingDate: "2/7/2026", amount: 3200.00 },
  { id: 4, name: "Madeon", dateReceived: "2/4/2026", shippingDate: "2/8/2026", amount: 1200.00 },
  { id: 5, name: "Daft Punk", dateReceived: "2/5/2026", shippingDate: "2/9/2026", amount: 450.00 },
]

interface VendorMasterlistProps {
  isSidebarMinimized?: boolean  // Add this prop to detect sidebar state
}

export default function VendorMasterlist({ isSidebarMinimized = false }: VendorMasterlistProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<VendorlistType | null>(null)

  const handleExpand = (vendor: VendorlistType) => {
    setSelectedVendor(vendor)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false)
    setSelectedVendor(null)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Add Vendor Modal */}
      <Vendoraddtab 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* Item Detail Modal */}
      <Vendordetailtab 
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        vendor={selectedVendor}
      />
    
      <div className={`p-6 mx-auto transition-all duration-300 ${isSidebarMinimized ? 'max-w-7xl' : 'max-w-5xl'}`}>

        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Search inventory..." 
              className="pl-10 pr-3 py-2 h-10 text-sm text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg placeholder:text-gray-500"
            />
          </div>

          <button className="flex items-center gap-1.5 px-3 py-2 h-10 text-sm font-bold text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 h-10 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>

        <Vendorlist onExpand={handleExpand} />
      </div>
    </div>
  );
}
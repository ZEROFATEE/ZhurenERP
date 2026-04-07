import { useState } from "react"
import InventoryList from "@/components/InventoryList"
import InventoryDetailTab from "@/components/InventoryDetailTab"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Search, Plus, Filter } from "lucide-react"

type Inventory = {
  id: number
  item: string
  name: string
  dateReceived: string
  shippingDate: string  // Changed from shipping
  amount: number
  status: "Received" | "NotReceived"
}

const mockInventory: Inventory[] = [
  { 
    id: 1, 
    item: "SSD-001", 
    name: "SAMSUNG SSD 870 EVO", 
    dateReceived: "4/1/2026", 
    shippingDate: "3/28/2026",  // Changed from shipping
    amount: 1250.00, 
    status: "Received" 
  },
  { 
    id: 2, 
    item: "RAM-032", 
    name: "Teamgroup T-Force Vulcan Z 32GB", 
    dateReceived: "4/3/2026", 
    shippingDate: "3/30/2026",  // Changed from shipping
    amount: 5400.00, 
    status: "NotReceived" 
  },
    { 
    id: 2, 
    item: "RAM-032", 
    name: "AMD Ryzen 9 9900X3D 12 Core 24", 
    dateReceived: "4/3/2026", 
    shippingDate: "3/30/2026",  // Changed from shipping
    amount: 5400.00, 
    status: "NotReceived" 
  },
]

export default function Inventory() {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null)

  const handleExpand = (item: Inventory) => {
    setSelectedItem(item)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedItem(null)
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <InventoryDetailTab 
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        item={selectedItem}
      />

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
          {/*    <span className="px-2.5 py-0.5 text-xs font-bold text-black bg-gray-200 rounded-full">
              {mockInventory.length}
            </span> */}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>
        </div>

        <div className="mb-4 max-w-xs">
          <InputGroup>
            <InputGroupAddon>
              <Search className="w-4 h-4 text-black" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search items..." />
          </InputGroup>
        </div>

        <InventoryList 
          data={mockInventory}
          onExpand={handleExpand} 
        />
      </div>
    </div>
  )
}
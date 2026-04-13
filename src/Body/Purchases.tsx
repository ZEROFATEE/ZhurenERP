import { useState } from "react";
import Purchase from "@/components/Purchase";
import PurchaseDetailTab from "@/components/PurchaseDetailTab";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Search, Plus, Filter } from "lucide-react"

type PurchaseType = {
  id: number
  qty: number
  item: string
  desc: string
  unitprice: number
  amount: number
  total: number
  shipmentDate: string
  receivedDate?: string
  status: "Received" | "Pending" | "NotReceived"
}

const mockPurchase: PurchaseType[] = [
  {
    id: 1, 
    qty: 5, 
    item: "SAMSUNG SSD 870 EVO", 
    desc: "1TB SSD", 
    unitprice: 2900, 
    amount: 14500, 
    total: 15500, 
    shipmentDate: "4/1/2026",
    receivedDate: "4/5/2026",
    status: "Received"
  },
  {
    id: 2, 
    qty: 3, 
    item: "Crucial RAM 32GB", 
    desc: "DDR5 5600MHz", 
    unitprice: 4500, 
    amount: 13500, 
    total: 14500, 
    shipmentDate: "4/2/2026",
    status: "Pending"
  },
  {
    id: 3, 
    qty: 2, 
    item: "Intel Core i9-13900K", 
    desc: "24-Core Processor", 
    unitprice: 25000, 
    amount: 50000, 
    total: 52000, 
    shipmentDate: "4/3/2026",
    status: "NotReceived"
  },
]

export default function Purchases() {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<PurchaseType | null>(null)
  const [purchaseData, setPurchaseData] = useState<PurchaseType[]>(mockPurchase)

  const handleExpand = (item: PurchaseType) => {
    setSelectedItem(item)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false)
    setSelectedItem(null)
  }

  const handleStatusUpdate = (purchaseId: number, newStatus: PurchaseType["status"]) => {
    setPurchaseData(prev => prev.map(p => 
      p.id === purchaseId ? { ...p, status: newStatus } : p
    ))
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Detail Modal */}
      <PurchaseDetailTab 
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        item={selectedItem}
        onStatusChange={handleStatusUpdate}
      />

      {/* Header row with search (left) and buttons (right) */}
      <div className="flex items-center justify-between gap-3">
        {/* Search bar - left side */}
        <InputGroup className="max-w-xs">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <Search className="w-4 h-4 text-black" />
          </InputGroupAddon>
        </InputGroup>

        {/* Buttons - right side */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 h-10 text-sm font-bold text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>

          <button 
            className="flex items-center gap-1.5 px-3 py-2 h-10 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
      </div>

      {/* Purchase list - MUST pass data prop */}
      <Purchase 
        data={purchaseData}
        onExpand={handleExpand} 
      />
    </div>
  );
}
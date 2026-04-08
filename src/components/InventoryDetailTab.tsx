import * as React from "react"
import { X, Package, Tag, Calendar, Truck, DollarSign, CheckCircle2 } from "lucide-react"

type Inventory = {
  id: number
  item: string
  name: string
  dateReceived: string
  shippingDate: string
  amount: number
  status: "Received" | "NotReceived"
}

interface InventoryDetailTabProps {
  isOpen: boolean
  onClose: () => void
  item: Inventory | null
}

const statusColors: Record<Inventory["status"], string> = {
  Received: "bg-green-100 text-green-700 border-green-200",
  NotReceived: "bg-yellow-100 text-yellow-700 border-yellow-200",
}

export default function InventoryDetailTab({ isOpen, onClose, item }: InventoryDetailTabProps) {
  if (!isOpen || !item) return null

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const details = [
    { label: "Item Code", value: item.item, icon: Tag },
    { label: "Product Name", value: item.name, icon: Package },
    { label: "Date Received", value: item.dateReceived, icon: Calendar },
    { label: "Shipping Date", value: item.shippingDate, icon: Truck },
    { label: "Total Amount", value: `$${item.amount.toLocaleString()}`, icon: DollarSign },
    { label: "Status", value: item.status, icon: CheckCircle2, isStatus: true },
  ]

  return (
    // Backdrop - click outside to close
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#000000' }}>Inventory Details</h2>
              <p className="text-sm text-black">Item #{item.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-black hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {details.map((detail) => (
              <div key={detail.label} className="space-y-1.5">
                <label className="text-xs font-bold text-black flex items-center gap-1.5">
                  <detail.icon className="w-3.5 h-3.5 text-black" />
                  {detail.label}
                </label>
                {detail.isStatus ? (
                  <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium border ${statusColors[item.status]}`}>
                    {detail.value}
                  </span>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium">
                    {detail.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
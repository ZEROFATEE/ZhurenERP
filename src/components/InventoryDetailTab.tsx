import * as React from "react"
import { X, Package, Tag, BarChart3, DollarSign, Receipt, Calendar, Truck, ClipboardList } from "lucide-react"
// ✅ FIXED: removed local Inventory type — use the real one from the API
import type { Inventory } from "@/api/inventory"

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
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen || !item) return null

  // ✅ FIXED: all fields now use snake_case to match the API Inventory type
  const itemClass     = item.item_class       || "General"
  const serial        = item.serial_number    || "N/A"
  const priceLevel    = item.price_level      ?? 0
  const taxType       = item.item_tax_type === "1" ? "VAT 12%" : "Tax Exempt"
  const lastUnitCost  = item.last_unit_cost   ?? 0
  const description   = item.description      || "No description available."
  const shippingDate  = item.shipping_date
    ? new Date(item.shipping_date).toLocaleDateString()
    : "N/A"
  const dateReceived  = item.date_received
    ? new Date(item.date_received).toLocaleDateString()
    : "N/A"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#000000' }}>Inventory Details</h2>
              <p className="text-sm text-gray-500">Item #{item.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-black hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Row 1: Item | Item Name | Item Class | Status */}
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />Item
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium font-mono">
                {item.item}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />Item Name
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium">
                {item.name}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />Item Class
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium">
                {itemClass}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5" />Status
              </label>
              <span className={`inline-flex w-full justify-center px-3 py-2 rounded-lg text-sm font-medium border ${statusColors[item.status]}`}>
                {item.status === "NotReceived" ? "Not Received" : item.status}
              </span>
            </div>
          </div>

          {/* Row 2: Serial | Price Level | Amount | Tax Type */}
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />Serial
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium font-mono">
                {serial}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />Price Level
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium">
                ₱{Number(priceLevel).toLocaleString()}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />Amount
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-right">
                ₱{Number(item.amount).toLocaleString()}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5" />Tax Type
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium">
                {taxType}
              </div>
            </div>
          </div>

          {/* Row 3: Last Unit Cost | Shipping Date | Date Received */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />Last Unit Cost
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-right">
                ₱{Number(lastUnitCost).toLocaleString()}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />Shipping Date
              </label>
              <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 font-medium text-center">
                {shippingDate}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />Date Received
              </label>
              <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium text-center">
                {dateReceived}
              </div>
            </div>
          </div>

          {/* Row 4: Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-black flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5" />Description
            </label>
            <div className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black leading-relaxed">
              {description}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
        </div>

      </div>
    </div>
  )
}
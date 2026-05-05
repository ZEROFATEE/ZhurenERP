// InventoryDetailTab.tsx

import * as React from "react"
import { X, Package } from "lucide-react"
// ✅ FIX: Import the real type from the API — delete whatever local type is defined in this file
import { type Inventory, updateInventory } from "@/api/inventory"

const selectColors: Record<Inventory["status"], string> = {
  Received: "bg-green-100 text-green-700 border-green-300",
  NotReceived: "bg-red-100 text-red-700 border-red-300",
}

interface InventoryDetailTabProps {
  isOpen: boolean
  onClose: () => void
  item: Inventory | null                                    // ✅ uses real Inventory type
  onStatusChange?: (id: number, newStatus: Inventory["status"]) => void
}

export default function InventoryDetailTab({ isOpen, onClose, item, onStatusChange }: InventoryDetailTabProps) {
  if (!isOpen || !item) return null

  const [currentStatus, setCurrentStatus] = React.useState(item.status)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    setCurrentStatus(item.status)
  }, [item])

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Inventory["status"]
    setCurrentStatus(newStatus)
    try {
      setSaving(true)
      await updateInventory(item.id, { status: newStatus })
      onStatusChange?.(item.id, newStatus)
    } catch (err) {
      console.error("Failed to update status:", err)
      alert("Failed to save status")
      setCurrentStatus(item.status)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-black">Inventory Details</h2>
              <p className="text-sm text-gray-500">{item.item} — {item.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-black hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Status */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <label className="text-xs font-bold text-black text-center block mb-2">
              Status {saving && "(Saving...)"}
            </label>
            <select
              value={currentStatus}
              onChange={handleStatusChange}
              disabled={saving}
              className={`w-full px-3 py-2 rounded-lg border text-sm font-medium text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${selectColors[currentStatus]}`}
            >
              <option value="Received">Received</option>
              <option value="NotReceived">Not Received</option>
            </select>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-4 gap-x-3 gap-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Item #</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.item}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Item Name</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.name || "—"}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Price Level</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {/* ✅ FIX: Number() handles both string and number from the API */}
                ₱{Number(item.price_level).toLocaleString()}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Amount</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                ₱{Number(item.amount).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-x-3 gap-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Item Class</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.item_class || "—"}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Tax Type</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.item_tax_type === "1" ? "Taxable" : "Exempt"}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Shipping Date</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.shipping_date ? new Date(item.shipping_date).toLocaleDateString() : "—"}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Date Received</label>
              <div className={`px-2 py-2 border rounded-lg text-sm font-medium text-center ${
                item.date_received
                  ? "bg-gray-50 border-gray-200 text-black"
                  : "bg-gray-100 border-gray-200 text-gray-500 italic"
              }`}>
                {item.date_received ? new Date(item.date_received).toLocaleDateString() : "—"}
              </div>
            </div>
          </div>

          {/* Optional extra fields */}
          <div className="grid grid-cols-3 gap-x-3 gap-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Serial #</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.serial_number || "—"}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Last Unit Cost</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.last_unit_cost ? `₱${Number(item.last_unit_cost).toLocaleString()}` : "—"}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Description</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.description || "—"}
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>
  )
}
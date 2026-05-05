import * as React from "react"
import { X, Package } from "lucide-react"
import { updatePurchase, type Purchase } from "@/api/purchases"

const selectColors: Record<string, string> = {
  Received: "bg-green-100 text-green-700 border-green-300",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  NotReceived: "bg-red-100 text-red-700 border-red-300",
}

interface PurchaseDetailTabProps {
  isOpen: boolean
  onClose: () => void
  item: Purchase | null
  onStatusChange?: (purchaseId: number, newStatus: Purchase["status"]) => void
}

export default function PurchaseDetailTab({ isOpen, onClose, item, onStatusChange }: PurchaseDetailTabProps) {
  // ✅ ALL HOOKS FIRST — always called, every render
  const [currentStatus, setCurrentStatus] = React.useState(item?.status ?? "Pending")
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (item) {
      setCurrentStatus(item.status)
    }
  }, [item])

   if (!isOpen || !item) return null

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Purchase["status"]
    setCurrentStatus(newStatus)
    
    try {
      setSaving(true)
      await updatePurchase(item.id, { status: newStatus })
      onStatusChange?.(item.id, newStatus)
    } catch (err) {
      console.error("Failed to update status:", err)
      alert("Failed to save status")
      setCurrentStatus(item.status) // Revert
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
              <h2 className="text-lg font-bold text-black">Purchase Details</h2>
              <p className="text-sm text-gray-500">Order #{item.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-black hover:bg-gray-100 rounded-lg transition-colors"
          >
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
              <option value="Pending">Pending</option>
              <option value="NotReceived">Not Received</option>
            </select>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-5 gap-x-3 gap-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Product Name</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.description || "—"}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Item Code</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.item}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Qty</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.qty}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Unit ₱</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {Number(item.unit_price).toLocaleString()}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Amount</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {Number(item.amount).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-x-3 gap-y-4 mt-4">
            <div className="invisible"><div>-</div></div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Shipment Date</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.shipment_date ? new Date(item.shipment_date).toLocaleDateString() : "—"}
              </div>
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Received Date</label>
              <div className={`px-2 py-2 border rounded-lg text-sm font-medium text-center ${
                item.received_date 
                  ? 'bg-gray-50 border-gray-200 text-black' 
                  : 'bg-gray-100 border-gray-200 text-gray-500 italic'
              }`}>
                {item.received_date ? new Date(item.received_date).toLocaleDateString() : "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
  
        </div>
      </div>
    </div>
  )
}
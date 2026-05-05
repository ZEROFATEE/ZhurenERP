import * as React from "react"
import { X, Package, CheckCircle2, AlertTriangle } from "lucide-react"
import {
  updatePurchase,
  transferPurchaseToInventory,
  removePurchaseFromInventory,
  type Purchase,
} from "@/api/purchases"

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

export default function PurchaseDetailTab({
  isOpen,
  onClose,
  item,
  onStatusChange,
}: PurchaseDetailTabProps) {
  // ✅ ALL HOOKS FIRST — always called, every render
  const [currentStatus, setCurrentStatus] = React.useState<Purchase["status"]>(
    item?.status ?? "Pending"
  )
  const [saving, setSaving] = React.useState(false)
  const [syncing, setSyncing] = React.useState(false)
  const [syncMessage, setSyncMessage] = React.useState<string | null>(null)
  const [syncError, setSyncError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (item) {
      setCurrentStatus(item.status)
      setSyncMessage(null)
      setSyncError(null)
    }
  }, [item])

  // ✅ CONDITIONAL RETURN AFTER ALL HOOKS
  if (!isOpen || !item) return null

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value as Purchase["status"]
    const previousStatus = currentStatus
    setCurrentStatus(newStatus)
    setSyncMessage(null)
    setSyncError(null)

    try {
      setSaving(true)

      // 1. Update purchase status first
      await updatePurchase(item.id, { status: newStatus })
      onStatusChange?.(item.id, newStatus)

      // 2. Sync with inventory based on new status
      setSyncing(true)

      if (newStatus === "Received") {
        // Add to inventory
        try {
          const { message } = await transferPurchaseToInventory(item.id)
          setSyncMessage(message)
        } catch (err: any) {
          if (err?.response?.status === 409) {
            setSyncError("This item already exists in inventory.")
          } else {
            setSyncError(
              err?.response?.data?.error || "Failed to add to inventory."
            )
          }
        }
      } else if (
        newStatus === "NotReceived" &&
        previousStatus === "Received"
      ) {
        // Remove from inventory (only if it was previously Received)
        try {
          const { message } = await removePurchaseFromInventory(item.id)
          setSyncMessage(message)
        } catch (err: any) {
          if (err?.response?.status === 404) {
            setSyncError("Item was not found in inventory.")
          } else {
            setSyncError(
              err?.response?.data?.error || "Failed to remove from inventory."
            )
          }
        }
      }
      // Pending: no inventory action needed
    } catch (err) {
      console.error("Failed to update status:", err)
      alert("Failed to save status")
      setCurrentStatus(item.status)
    } finally {
      setSaving(false)
      setSyncing(false)
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
          {/* Status Section */}
          <div className="mb-6 pb-4 border-b border-gray-200 space-y-3">
            <div>
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

            {/* Sync Status Messages */}
            {syncing && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                {currentStatus === "Received"
                  ? "Adding to inventory..."
                  : "Removing from inventory..."}
              </div>
            )}

            {syncMessage && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                <CheckCircle2 className="w-4 h-4" />
                {syncMessage}
              </div>
            )}

            {syncError && (
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                <AlertTriangle className="w-4 h-4" />
                {syncError}
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-5 gap-x-3 gap-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">
                Product Name
              </label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.description || "—"}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">
                Item Code
              </label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.item}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">
                Qty
              </label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.qty}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">
                Unit ₱
              </label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {Number(item.unit_price).toLocaleString()}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">
                Amount
              </label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {Number(item.amount).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-x-3 gap-y-4 mt-4">
            <div className="invisible">
              <div>-</div>
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">
                Shipment Date
              </label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.shipment_date
                  ? new Date(item.shipment_date).toLocaleDateString()
                  : "—"}
              </div>
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">
                Received Date
              </label>
              <div
                className={`px-2 py-2 border rounded-lg text-sm font-medium text-center ${
                  item.received_date
                    ? "bg-gray-50 border-gray-200 text-black"
                    : "bg-gray-100 border-gray-200 text-gray-500 italic"
                }`}
              >
                {item.received_date
                  ? new Date(item.received_date).toLocaleDateString()
                  : "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100" />
      </div>
    </div>
  )
}
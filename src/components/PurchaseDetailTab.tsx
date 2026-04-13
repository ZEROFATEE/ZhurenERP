import * as React from "react"
import { X, Package, Tag, Calculator, DollarSign, CheckCircle2, Calendar, Truck, FileText } from "lucide-react"

type Purchase = {
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

interface PurchaseDetailTabProps {
  isOpen: boolean
  onClose: () => void
  item: Purchase | null
  onStatusChange?: (purchaseId: number, newStatus: Purchase["status"]) => void
}

const selectColors: Record<string, string> = {
  Received: "bg-green-100 text-green-700 border-green-300",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  NotReceived: "bg-red-100 text-red-700 border-red-300",
}

export default function PurchaseDetailTab({ isOpen, onClose, item, onStatusChange }: PurchaseDetailTabProps) {
  if (!isOpen || !item) return null

  const [currentStatus, setCurrentStatus] = React.useState(item.status)

  React.useEffect(() => {
    setCurrentStatus(item.status)
  }, [item])

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Purchase["status"]
    setCurrentStatus(newStatus)
    onStatusChange?.(item.id, newStatus)
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
              <h2 className="text-lg font-bold text-center"style={{color: '#000000'}}>Purchase Details</h2>
              <p className="text-sm">Order #{item.id}</p>
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
          {/* Status Bar at TOP */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <label className="text-xs font-bold text-black text-center block mb-2">
              Status (Editable)
            </label>
            <select
              value={currentStatus}
              onChange={handleStatusChange}
              className={`w-full px-3 py-2 rounded-lg border text-sm font-medium text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${selectColors[currentStatus]}`}
            >
              <option value="Received">Received</option>
              <option value="Pending">Pending</option>
              <option value="NotReceived">Not Received</option>
            </select>
          </div>

          {/* Row 1: Product Name | Item Code | Quantity | Unit Price | Amount (5 columns) */}
          <div className="grid grid-cols-5 gap-x-3 gap-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Product Name</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center truncate" title={item.desc}>
                {item.desc}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Item Code</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center truncate" title={item.item}>
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
                {item.unitprice.toLocaleString()}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Amount</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.amount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Row 2: Spacer | Shipment Date | Spacer | Received Date | Spacer */}
          <div className="grid grid-cols-5 gap-x-3 gap-y-4 mt-4">
            <div className="invisible">
              <label className="text-xs font-bold text-black text-center block">-</label>
              <div className="px-2 py-2">-</div>
            </div>
            
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Shipment Date</label>
              <div className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-center">
                {item.shipmentDate}
              </div>
            </div>
            
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Received Date</label>
              <div className={`px-2 py-2 border rounded-lg text-sm font-medium text-center ${
                item.receivedDate 
                  ? 'bg-gray-50 border-gray-200 text-black' 
                  : 'bg-gray-100 border-gray-200 text-gray-500 italic'
              }`}>
                {item.receivedDate || "—"}
              </div>
            </div>
          </div>

          {/* Row 3: Description (full width) */}
          <div className="mt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black text-center block">Description</label>
              <div className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black font-medium text-left min-h-[80px]">
                {item.desc}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
} 
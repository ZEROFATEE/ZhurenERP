import * as React from "react"
import { useEffect, useState } from "react"
import {
  X,
  User,
  Phone,
  MapPin,
  CreditCard,
  Mail,
  ShoppingCart,
  Calendar,
  Hash,
  Package,
  PhilippinePeso,
} from "lucide-react"
import { getSalesByCustomer, type SaleRecord } from "@/api/sales"
import { type Vendor } from "@/api/vendor"

interface CustomerDetailTabProps {
  isOpen: boolean
  onClose: () => void
  customer: Vendor | null
}

const TABLE_COLUMNS = "60px 1.5fr 1.5fr 120px 100px 120px 120px"

export default function CustomerDetailTab({
  isOpen,
  onClose,
  customer,
}: CustomerDetailTabProps) {
  const [sales, setSales] = useState<SaleRecord[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (customer?.id) {
      setLoading(true)
      getSalesByCustomer(customer.id)
        .then(data => setSales(data))
        .catch(err => console.error("Failed to fetch sales:", err))
        .finally(() => setLoading(false))
    }
  }, [customer?.id])

  if (!isOpen || !customer) return null

  const totalSpent = sales.reduce((sum, sale) => sum + Number(sale.amount), 0)
  const totalItems = sales.reduce((sum, sale) => sum + sale.qty, 0)

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-black">Customer Details</h2>
                <p className="text-sm text-gray-500">Account: {customer.account || "N/A"}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-xs mt-3">
              <div className="flex items-start gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-500 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-gray-500 block">Contact</span>
                  <span className="font-medium text-gray-900">
                    {customer.contact || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-500 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-gray-500 block">Address</span>
                  <span className="font-medium text-gray-900 break-words">
                    {customer.mailing_address || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-500 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-gray-500 block">Email</span>
                  <span className="font-medium text-gray-900 break-all">
                    {customer.email || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-gray-500 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-gray-500 block">Balance</span>
                  <span className="font-medium text-gray-900">
                    ₱{Number(customer.amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4 shrink-0">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase">Total Spent</p>
              <p className="text-lg font-bold text-green-600 flex items-center justify-end gap-1">
                <PhilippinePeso className="w-5 h-5" />
                {totalSpent.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-black hover:bg-gray-200 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Purchase History Table */}
        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-bold text-black">Purchase History</h3>
          </div>

          <div className="rounded-md border w-full">
            {/* Table Header */}
            <div
              className="grid gap-4 text-xs font-semibold text-muted-foreground items-center px-4 py-3 bg-muted"
              style={{ gridTemplateColumns: TABLE_COLUMNS }}
            >
              <span className="text-center">#</span>
              <span>Item</span>
              <span>Serial #</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Unit ₱</span>
              <span className="text-right">Amount</span>
              <span className="text-center">Date</span>
            </div>

            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">Loading purchases...</div>
              ) : sales.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                  No purchase history for this customer.
                </div>
              ) : (
                sales.map((sale, index) => (
                  <div
                    key={sale.id}
                    className="grid gap-4 items-center px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                    style={{ gridTemplateColumns: TABLE_COLUMNS }}
                  >
                    <span className="text-center text-muted-foreground">{index + 1}</span>
                    
                    <div className="min-w-0">
                      <div className="font-medium text-black truncate">{sale.item_name}</div>
                      <div className="text-xs text-gray-400 font-mono">{sale.item_code}</div>
                    </div>

                    <div className="font-mono text-xs text-black">
                      {sale.serial_number}
                    </div>

                    <span className="text-center font-medium text-black">
                      {sale.qty}
                    </span>

                    <span className="text-right text-black">
                      ₱{Number(sale.price_level).toLocaleString()}
                    </span>

                    <span className="text-right font-medium text-black">
                      ₱{Number(sale.amount).toLocaleString()}
                    </span>

                    <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {new Date(sale.date_sold).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Package className="w-4 h-4" />
            <span>{sales.length} order{sales.length !== 1 ? "s" : ""} • {totalItems} item{totalItems !== 1 ? "s" : ""} total</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-black hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}
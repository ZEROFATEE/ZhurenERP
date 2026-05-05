import * as React from "react"
import { useEffect, useState } from "react"
import { 
  X, 
  PhilippinePeso,
  Phone,
  MapPin,
  CreditCard,
  Mail
} from "lucide-react"
import { getVendor, type Vendor, type VendorItem } from "@/api/vendor"

interface VendordetailtabProps {
  isOpen: boolean
  onClose: () => void
  vendor: Vendor | null
  onNavigateToInventory?: (tab: string, itemName?: string) => void
}

const formatPHP = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(amount)
}

const TABLE_COLUMNS = "80px 1.5fr 1.5fr 1.5fr 1.5fr"

const columns = [
  { key: 'qty',          label: 'Qty',           tab: 'stock'     },
  { key: 'name',         label: 'Name',          tab: 'products'  },
  { key: 'date_received', label: 'Date Received', tab: 'receiving' },
  { key: 'shipping_date', label: 'Shipping Date', tab: 'shipping'  },
  { key: 'amount',       label: 'Amount (PHP)',  tab: 'finance'   },
]

// utils/formatters.ts
export const formatAccount = (value: string): string => {
  // Strip everything except digits
  const digits = value.replace(/\D/g, '')
  // Return with ACC- prefix
  return digits ? `ACC-${digits}` : 'ACC-'
}

export const formatContact = (value: string): string => {
  // Strip everything except digits
  const digits = value.replace(/\D/g, '')
  // Return with +63 prefix
  return digits ? `+63${digits}` : '+63'
}

export const cleanAccount = (value: string): string => {
  // Extract just the digits after ACC-
  return value.replace(/^ACC-/, '').replace(/\D/g, '')
}

export const cleanContact = (value: string): string => {
  // Extract just the digits after +63
  return value.replace(/^\+63/, '').replace(/\D/g, '')
}
export default function Vendordetailtab({ 
  isOpen, 
  onClose, 
  vendor,
  onNavigateToInventory 
}: VendordetailtabProps) {
  const [items, setItems] = useState<VendorItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (vendor?.id) {
      setLoading(true)
      getVendor(vendor.id)
        .then(data => {
          setItems(data.items || [])
        })
        .catch(err => {
          console.error("Failed to fetch vendor details:", err)
        })
        .finally(() => setLoading(false))
    }
  }, [vendor?.id])

  if (!isOpen || !vendor) return null

  const totalAmount = items.reduce((sum, item) => sum + Number(item.amount), 0)
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0)

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleColumnClick = (tab: string, item: VendorItem) => {
    onNavigateToInventory?.(tab, item.name)
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-black">Vendor Details</h2>
            <p className="text-sm text-gray-500 mb-3">
              Supplier: <span className="font-bold text-gray-900">{vendor.name}</span>
            </p>
            <div className="grid grid-cols-4 gap-4 text-xs">
              <div className="flex items-start gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-500 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-gray-500 block">Contact</span>
                  <span className="font-medium text-gray-900">
                    {vendor.contact || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-500 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-gray-500 block">Mailing Address</span>
                  <span className="font-medium text-gray-900 break-words">
                    {vendor.mailing_address || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-gray-500 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-gray-500 block">Account</span>
                  <span className="font-medium text-gray-900 font-mono">
                    {vendor.account || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-500 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="text-gray-500 block">Email</span>
                  <span className="font-medium text-gray-900 break-all">
                    {vendor.email || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4 shrink-0">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase">Total Amount</p>
              <p className="text-lg font-bold text-green-600 flex items-center justify-end gap-1">
                <PhilippinePeso className="w-5 h-5" />
                {formatPHP(totalAmount).replace('PHP', '').trim()}
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

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          <div className="rounded-md border w-full">
            <div className="flex items-center bg-muted px-4 py-3">
              <div 
                className="grid gap-4 text-xs font-semibold text-muted-foreground items-center flex-1"
                style={{ display: 'grid', gridTemplateColumns: TABLE_COLUMNS }}
              >
                {columns.map((col) => (
                  <span 
                    key={col.key} 
                    className={
                      col.key === 'amount' ? 'text-right' : 
                      col.key === 'qty'    ? 'text-center' : ''
                    }
                  >
                    {col.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">Loading items...</div>
              ) : items.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-400 text-sm">No items found for this vendor.</div>
              ) : (
                items.map((item, index) => (
                  <div 
                    key={`${item.name}-${index}`}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div 
                      className="grid gap-4 items-center flex-1 text-sm"
                      style={{ display: 'grid', gridTemplateColumns: TABLE_COLUMNS }}
                    >
                      <button
                        onClick={() => handleColumnClick('stock', item)}
                        className="font-medium text-gray-900 text-center hover:text-blue-600 hover:underline transition-colors"
                      >
                        {item.qty}
                      </button>
                      <button
                        onClick={() => handleColumnClick('products', item)}
                        className="font-medium text-gray-900 text-left hover:text-blue-600 hover:underline transition-colors"
                      >
                        {item.name}
                      </button>
                      <button
                        onClick={() => handleColumnClick('receiving', item)}
                        className="text-gray-600 text-left hover:text-blue-600 hover:underline transition-colors"
                      >
                        {item.date_received 
                          ? new Date(item.date_received).toLocaleDateString() 
                          : "—"}
                      </button>
                      <button
                        onClick={() => handleColumnClick('shipping', item)}
                        className="text-gray-600 text-left hover:text-blue-600 hover:underline transition-colors"
                      >
                        {item.shipping_date 
                          ? new Date(item.shipping_date).toLocaleDateString() 
                          : "—"}
                      </button>
                      <button
                        onClick={() => handleColumnClick('finance', item)}
                        className="font-medium text-gray-900 text-right flex items-center justify-end gap-1 hover:text-blue-600 hover:underline transition-colors"
                      >
                        <PhilippinePeso className="w-3.5 h-3.5 text-gray-500" />
                        {Number(item.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </button>
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
            <span>Showing {items.length} orders • Total Qty: {totalQty}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
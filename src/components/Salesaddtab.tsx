import * as React from "react"
import { X, Package, User, Hash, DollarSign, ShoppingCart } from "lucide-react"
import { getAvailableItems, type SaleableItem } from "@/api/sales"
import { getVendors, type Vendor } from "@/api/vendor"

interface SalesAddTabProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (sale: any) => void
}

export default function SalesAddTab({ isOpen, onClose, onSave }: SalesAddTabProps) {
  const [customers, setCustomers] = React.useState<Vendor[]>([])
  const [availableItems, setAvailableItems] = React.useState<SaleableItem[]>([])
  const [loading, setLoading] = React.useState(false)

  const [formData, setFormData] = React.useState({
    customerId: "",
    itemId: "",
    serialNumber: "",
    qty: "1",
    priceLevel: "",
    amount: "",
  })

  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch customers and available items when modal opens
  React.useEffect(() => {
    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [vendorsData, itemsData] = await Promise.all([
        getVendors(),
        getAvailableItems()
      ])
      setCustomers(vendorsData)
      setAvailableItems(itemsData)
    } catch (err) {
      setError("Failed to load data. Is the server running?")
    } finally {
      setLoading(false)
    }
  }

  // When item changes, auto-pick first available serial number for that item
  const handleItemChange = (itemId: string) => {
    if (!itemId) {
      setFormData(prev => ({
        ...prev,
        itemId: "",
        serialNumber: "",
        priceLevel: "",
        amount: "",
      }))
      return
    }

    const selectedItem = availableItems.find(item => String(item.id) === itemId)
    if (!selectedItem) return

    // Find all items with the same item code (e.g., ITEM-001)
    const sameItemCode = availableItems.filter(
      item => item.item === selectedItem.item
    )

    // Pick the first available serial number (FIFO - lowest SN number)
    const firstSerial = sameItemCode
      .filter(item => item.serial_number)
      .sort((a, b) => {
        const numA = parseInt(a.serial_number?.replace("SN-", "") || "0")
        const numB = parseInt(b.serial_number?.replace("SN-", "") || "0")
        return numA - numB
      })[0]?.serial_number || ""

    const qty = parseInt(formData.qty) || 1
    const price = Number(selectedItem.price_level) || 0

    setFormData(prev => ({
      ...prev,
      itemId,
      serialNumber: firstSerial,
      priceLevel: String(price),
      amount: String(price * qty),
    }))
  }

  const handleQtyChange = (value: string) => {
    const num = parseInt(value)
    if (value === "") {
      setFormData(prev => ({ ...prev, qty: "", amount: "" }))
    } else if (!isNaN(num) && num >= 1) {
      const price = parseFloat(formData.priceLevel) || 0
      setFormData(prev => ({
        ...prev,
        qty: String(num),
        amount: String(price * num),
      }))
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (!formData.customerId) {
      setError("Please select a customer.")
      setSaving(false)
      return
    }
    if (!formData.itemId) {
      setError("Please select an item.")
      setSaving(false)
      return
    }
    if (!formData.serialNumber) {
      setError("No available serial number for this item.")
      setSaving(false)
      return
    }

    try {
      const selectedItem = availableItems.find(
        item => String(item.id) === formData.itemId
      )

      // TODO: Replace with your actual createSale API call
      const saleData = {
        customer_id: parseInt(formData.customerId),
        item_id: parseInt(formData.itemId),
        item_code: selectedItem?.item,
        item_name: selectedItem?.name,
        serial_number: formData.serialNumber,
        qty: parseInt(formData.qty),
        price_level: parseFloat(formData.priceLevel),
        amount: parseFloat(formData.amount),
        date_sold: new Date().toISOString().split('T')[0],
      }

      // Mock API call - replace with actual endpoint
      // const newSale = await createSale(saleData)
      
      onSave?.(saleData)
      resetForm()
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to save sale. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      customerId: "",
      itemId: "",
      serialNumber: "",
      qty: "1",
      priceLevel: "",
      amount: "",
    })
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  const selectedItem = availableItems.find(
    item => String(item.id) === formData.itemId
  )

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
  const disabledClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 cursor-not-allowed font-mono"
  const labelClass = "text-xs font-bold text-black flex items-center gap-1.5"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#000000' }}>New Sale</h2>
              <p className="text-sm text-gray-500">Create a new sales transaction</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-black hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {loading && (
            <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-600">
              Loading data...
            </div>
          )}

          {/* Row 1: Customer | Item | Serial # (auto-picked) */}
          <div className="grid grid-cols-3 gap-x-4">
            {/* Customer */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                <User className="w-3.5 h-3.5" />
                Customer
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => handleChange("customerId", e.target.value)}
                className={inputClass}
              >
                <option value="">Select customer...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Item */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                <Package className="w-3.5 h-3.5" />
                Item
              </label>
              <select
                value={formData.itemId}
                onChange={(e) => handleItemChange(e.target.value)}
                className={inputClass}
              >
                <option value="">Select item...</option>
                {/* Group by item code to avoid duplicates, show name */}
                {Array.from(new Map(availableItems.map(item => [item.item, item])).values())
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.item} — {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Serial # - auto-picked from first available SN */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                <Hash className="w-3.5 h-3.5" />
                Serial # <span className="text-gray-400 font-normal">(auto)</span>
              </label>
              <input
                type="text"
                value={formData.serialNumber || "—"}
                disabled
                className={disabledClass}
              />
              {selectedItem && (
                <p className="text-xs text-gray-400">
                  First available SN for {selectedItem.item}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Qty | Price Level | Amount */}
          <div className="grid grid-cols-3 gap-x-4">
            <div className="space-y-1.5">
              <label className={labelClass}>
                <Hash className="w-3.5 h-3.5" />
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={formData.qty}
                onChange={(e) => handleQtyChange(e.target.value)}
                className={inputClass}
                placeholder="1"
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>
                <DollarSign className="w-3.5 h-3.5" />
                Price Level
              </label>
              <input
                type="text"
                value={formData.priceLevel ? `₱${Number(formData.priceLevel).toLocaleString()}` : "—"}
                disabled
                className={disabledClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>
                <DollarSign className="w-3.5 h-3.5" />
                Total Amount
              </label>
              <input
                type="text"
                value={formData.amount ? `₱${Number(formData.amount).toLocaleString()}` : "—"}
                disabled
                className={disabledClass}
              />
            </div>
          </div>

          {/* Item Details Preview */}
          {selectedItem && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1">
              <p className="text-xs font-bold text-black">Selected Item Details</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <span>Item Class: {selectedItem.item_class || "—"}</span>
                <span>Tax Type: {selectedItem.item_tax_type === "1" ? "Taxable" : "Exempt"}</span>
                <span className="col-span-2">
                  Description: {selectedItem.description || "—"}
                </span>
              </div>
            </div>
          )}  

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving || loading}
              className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? "Saving..." : "Complete Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
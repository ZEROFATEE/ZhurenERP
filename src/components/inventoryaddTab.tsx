import * as React from "react"
import { X, Hash, Package, FileText, Folder, DollarSign, BookOpen, BookOpenCheck, Percent, CalendarDays } from "lucide-react"
import { type Inventory as InventoryType, getInventories } from "@/api/inventory"
import { getPurchases, createPurchase, type Purchase as PurchaseType } from "@/api/purchases"

interface InventoryAddProps {
  isOpen: boolean
  onClose: () => void
  // ✅ onSave now returns a Purchase since that's what gets created first
  onSave?: (purchase: PurchaseType) => void
}

export default function InventoryAddTab({ isOpen, onClose, onSave }: InventoryAddProps) {
  const [formData, setFormData] = React.useState({
    itemName: "",
    description: "",
    itemClass: "",
    priceLevel: "",
    glSalesAccount: "",
    inventoryAccount: "",
    glCostOfSalesAccount: "",
    itemTaxType: "1",
    serialNumber: "",
    lastUnitCost: "",
    shipmentDate: "",
    releasedDate: "",
    qty: "1",
  })

  const [generatedItem, setGeneratedItem] = React.useState<string>("")
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  React.useEffect(() => {
    if (isOpen) initializeForm()
  }, [isOpen])

  const initializeForm = async () => {
    try {
      // ✅ Pull from BOTH purchases and inventory to avoid item code collisions
      const [inventory, purchases] = await Promise.all([
        getInventories(),
        getPurchases(),
      ])

      // Item number: highest ITEM-NNN across both tables + 1
      const maxFromInventory = inventory.reduce((acc: number, p: InventoryType) => {
        const match = p.item?.match(/^ITEM-(\d+)$/)
        if (match) { const n = parseInt(match[1], 10); return n > acc ? n : acc }
        return acc
      }, 0)
      const maxFromPurchases = purchases.reduce((acc: number, p: PurchaseType) => {
        const match = p.item?.match(/^ITEM-(\d+)$/)
        if (match) { const n = parseInt(match[1], 10); return n > acc ? n : acc }
        return acc
      }, 0)
      const nextItem = `ITEM-${String(Math.max(maxFromInventory, maxFromPurchases) + 1).padStart(3, "0")}`
      setGeneratedItem(nextItem)

      // Serial number: FIFO gap-fill across both tables
      const usedSerials = new Set<number>()
      inventory.forEach((p: InventoryType) => {
        const match = p.serial_number?.match(/^SN-(\d+)$/)
        if (match) usedSerials.add(parseInt(match[1], 10))
      })
      let nextSerial = 1
      while (usedSerials.has(nextSerial)) nextSerial++
      const nextSerialStr = `SN-${String(nextSerial).padStart(3, "0")}`

      // GL accounts based on purchase count
      const nextGlSales = 1000 + purchases.length * 200

      setFormData(prev => ({
        ...prev,
        serialNumber: nextSerialStr,
        glSalesAccount: `Php ${nextGlSales.toLocaleString()}`,
        glCostOfSalesAccount: "Php 2,000",
      }))
    } catch {
      setGeneratedItem("ITEM-001")
      setFormData(prev => ({
        ...prev,
        serialNumber: "SN-001",
        glSalesAccount: "Php 1,000",
        glCostOfSalesAccount: "Php 2,000",
      }))
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleQtyChange = (value: string) => {
    const num = parseInt(value)
    if (value === "") {
      setFormData(prev => ({ ...prev, qty: "" }))
    } else if (!isNaN(num) && num >= 1) {
      setFormData(prev => ({ ...prev, qty: String(num) }))
    }
  }

  const handleDateChange = (field: string, value: string) => {
    if (!value) { handleChange(field, ""); return }
    const [yearStr] = value.split("-")
    if (yearStr.length > 4) return
    if (value < today) return
    handleChange(field, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (formData.shipmentDate && formData.shipmentDate < today) {
      setError("Shipment Date cannot be set in the past.")
      setSaving(false)
      return
    }
    if (formData.releasedDate && formData.releasedDate < today) {
      setError("Released Date cannot be set in the past.")
      setSaving(false)
      return
    }

    const unitPrice = parseFloat(formData.priceLevel) || 0
    const qty = parseInt(formData.qty) || 1

    try {
      // ✅ Creates a Purchase record with status: Pending
      // The item only moves to inventory once marked Received in the Purchase tab
      const newPurchase = await createPurchase({
        qty,
        item: generatedItem,
        description: formData.itemName || formData.description || undefined,
        unit_price: unitPrice,
        amount: unitPrice * qty,
        total: unitPrice * qty * (formData.itemTaxType === "1" ? 1.12 : 1),
        shipment_date: formData.shipmentDate || undefined,
        received_date: formData.releasedDate || undefined,
        status: "Pending",   // ✅ always Pending — must be received before appearing in Sales
      })

      onSave?.(newPurchase)
      setFormData({
        itemName: "",
        description: "",
        itemClass: "",
        priceLevel: "",
        glSalesAccount: "",
        inventoryAccount: "",
        glCostOfSalesAccount: "",
        itemTaxType: "1",
        serialNumber: "",
        lastUnitCost: "",
        shipmentDate: "",
        releasedDate: "",
        qty: "1",
      })
      setGeneratedItem("")
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
  const disabledClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 cursor-not-allowed font-mono"
  const labelClass = "text-xs font-bold text-black flex items-center gap-1.5"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#000000' }}>Add New Inventory Item</h2>
              <p className="text-sm text-gray-500">Item will appear in Purchases as Pending until received</p>
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

          {/* ✅ Info banner explaining the flow */}
          <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            This item will be created as a <strong>Pending purchase</strong>. Once marked as Received in the Purchases tab, it will appear in Inventory and Sales.
          </div>

          {/* Row 1: Item # | Item Name | Item Class | Item Tax Type */}
          <div className="grid grid-cols-4 gap-x-4">
            <div className="space-y-1.5">
              <label className={labelClass}><Hash className="w-3.5 h-3.5" />Item #</label>
              <input type="text" value={generatedItem || "Generating..."} disabled className={disabledClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><Package className="w-3.5 h-3.5" />Item Name</label>
              <input
                type="text"
                value={formData.itemName}
                onChange={(e) => handleChange("itemName", e.target.value)}
                className={inputClass}
                placeholder="Product name"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><Folder className="w-3.5 h-3.5" />Item Class</label>
              <select value={formData.itemClass} onChange={(e) => handleChange("itemClass", e.target.value)} className={inputClass}>
                <option value="">Select class...</option>
                <option value="PC Peripherals">PC Peripherals</option>
                <option value="Printer">Printer</option>
                <option value="Storage">Storage</option>
                <option value="Wires">Wires</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><Percent className="w-3.5 h-3.5" />Item Tax Type</label>
              <select value={formData.itemTaxType} onChange={(e) => handleChange("itemTaxType", e.target.value)} className={inputClass}>
                <option value="1">1 - Taxable</option>
                <option value="2">2 - Exempt</option>
              </select>
            </div>
          </div>

          {/* Row 2: Price Level | GL Sales Account | GL Cost of Sales | Inventory Account */}
          <div className="grid grid-cols-4 gap-x-4">
            <div className="space-y-1.5">
              <label className={labelClass}><DollarSign className="w-3.5 h-3.5" />Price Level</label>
              <input type="number" min="0" value={formData.priceLevel} onChange={(e) => handleChange("priceLevel", e.target.value)} className={inputClass} placeholder="0.00" />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><BookOpen className="w-3.5 h-3.5" />GL Sales Account</label>
              <input type="text" value={formData.glSalesAccount} onChange={(e) => handleChange("glSalesAccount", e.target.value)} className={inputClass} placeholder="Php 1,000" />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><BookOpenCheck className="w-3.5 h-3.5" />GL Cost of Sales</label>
              <input type="text" value={formData.glCostOfSalesAccount} onChange={(e) => handleChange("glCostOfSalesAccount", e.target.value)} className={inputClass} placeholder="Php 2,000" />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><Package className="w-3.5 h-3.5" />Inventory Account</label>
              <input type="text" value={formData.inventoryAccount} onChange={(e) => handleChange("inventoryAccount", e.target.value)} className={inputClass} placeholder="Account code" />
            </div>
          </div>

          {/* Row 3: Quantity | Serial # | Shipment Date | Released Date */}
          <div className="grid grid-cols-4 gap-x-4">
            <div className="space-y-1.5">
              <label className={labelClass}><Hash className="w-3.5 h-3.5" />Quantity</label>
              <input type="number" min="1" value={formData.qty} onChange={(e) => handleQtyChange(e.target.value)} className={inputClass} placeholder="1" />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><Hash className="w-3.5 h-3.5" />Serial #</label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => handleChange("serialNumber", e.target.value)}
                className={inputClass}
                placeholder="SN-001"
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><CalendarDays className="w-3.5 h-3.5" />Shipment Date</label>
              <input
                type="date"
                value={formData.shipmentDate}
                onChange={(e) => handleDateChange("shipmentDate", e.target.value)}
                min={today}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><CalendarDays className="w-3.5 h-3.5" />Released Date</label>
              <input
                type="date"
                value={formData.releasedDate}
                onChange={(e) => handleDateChange("releasedDate", e.target.value)}
                min={today}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 4: Description */}
          <div className="space-y-1.5">
            <label className={labelClass}><FileText className="w-3.5 h-3.5" />Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              placeholder="Item description..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving || !generatedItem}
              className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? "Saving..." : "Submit to Purchases"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
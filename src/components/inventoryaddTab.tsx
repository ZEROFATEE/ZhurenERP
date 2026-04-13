import * as React from "react"
import { X, Hash, Package, FileText, Folder, DollarSign, BookOpen, BookOpenCheck, Percent } from "lucide-react"

type Inventory = {
  id: number
  item: string
  name: string
  dateReceived: string
  shippingDate: string
  amount: number
  status: "Received" | "NotReceived"
}

interface InventoryAddTabProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (inventory: Inventory) => void
}

export default function InventoryAddTab({ isOpen, onClose, onSave }: InventoryAddTabProps) {
  if (!isOpen) return null

  const [formData, setFormData] = React.useState({
    itemNumber: "",
    itemName: "",
    description: "",
    itemClass: "",
    priceLevel: "",
    glSalesAccount: "",
    inventoryAccount: "",
    glCostOfSalesAccount: "",
    itemTaxType: "1",
    serialNumber: "",
    lastUnitCost: ""
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newInventory: Inventory = {
      id: 0,
      item: formData.itemNumber,
      name: formData.itemName,
      dateReceived: new Date().toLocaleDateString(),
      shippingDate: new Date().toLocaleDateString(),
      amount: parseFloat(formData.priceLevel) || 0,
      status: "NotReceived"
    }
    onSave?.(newInventory)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl max-h-[95vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-black">Add New Inventory Item</h2>
              <p className="text-sm text-black">Enter item details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-black hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Row 1: Item # | Item Name | Description | Item Class (4 columns) */}
          <div className="grid grid-cols-4 gap-x-4 gap-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-black" />
                Item #
              </label>
              <input
                type="text"
                value={formData.itemNumber}
                onChange={(e) => handleChange("itemNumber", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="ITEM-001"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-black" />
                Item Name
              </label>
              <input
                type="text"
                value={formData.itemName}
                onChange={(e) => handleChange("itemName", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Product name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-black" />
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Item description"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-black" />
                Item Class
              </label>
              <input
                type="text"
                value={formData.itemClass}
                onChange={(e) => handleChange("itemClass", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Item class"
              />
            </div>
          </div>

          {/* Row 2: 4 columns */}
          <div className="grid grid-cols-4 gap-x-4 gap-y-4 mt-4">

            {/* Column 1: Price Level + Serial # */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-black" />
                  Price Level
                </label>
                <input
                  type="number"
                  value={formData.priceLevel}
                  onChange={(e) => handleChange("priceLevel", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black flex items-center gap-1.5">
                  Serial #
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => handleChange("serialNumber", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="SN001"
                />
              </div>
                 <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-black flex items-center gap-1.5">
                  Last Unit Cost
                </label>
                <input
                  type="number"
                  value={formData.lastUnitCost}
                  onChange={(e) => handleChange("lastUnitCost", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Column 2: Empty spacer */}
            <div></div>

            {/* Column 3: GL Sales Account + Inventory Account + GL Cost of Sales */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-black" />
                  GL Sales Account
                </label>
                <input
                  type="text"
                  value={formData.glSalesAccount}
                  onChange={(e) => handleChange("glSalesAccount", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="Account code"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-black" />
                  Inventory Account
                </label>
                <input
                  type="text"
                  value={formData.inventoryAccount}
                  onChange={(e) => handleChange("inventoryAccount", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="Account code"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black flex items-center gap-1.5">
                  <BookOpenCheck className="w-3.5 h-3.5 text-black" />
                  GL Cost of Sales Account
                </label>
                <input
                  type="text"
                  value={formData.glCostOfSalesAccount}
                  onChange={(e) => handleChange("glCostOfSalesAccount", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="Account code"
                />
              </div>
            </div>

            {/* Column 4: Item Tax Type + Last Unit Cost */}
            <div className="space-y-3">
              <div className="space-y-1.5">
  <label className="text-xs font-bold text-black flex items-center gap-1.5">
    <Percent className="w-3.5 h-3.5 text-black" />
    Item Tax Type
  </label>
  <select
    value={formData.itemTaxType}
    onChange={(e) => handleChange("itemTaxType", e.target.value)}
    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
  >
    <option value="1">1 - Taxable</option>
    <option value="2">2 - Exempt</option>
  </select>
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm"
            >
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
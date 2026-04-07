//NOTE MAKE THE ITEMS CLICKABLE 

import * as React from "react"
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
  PhilippinePeso
} from "lucide-react"

type Vendorlist = {
  id: number
  name: string
  dateReceived: string
  shippingDate: string
  amount: number
}



// Extended item details with all required fields
interface ItemDetail {
  item: string        // Item code (ITM-001, etc.)
  name: string        // Item name (SSD, RAM, etc.)
  dateReceived: string
  shippingDate: string
  amount: number      // In PHP
}

interface VendordetailtabProps {
  isOpen: boolean
  onClose: () => void
  vendor: Vendorlist | null
}

// Get item details based on vendor name
const getItemDetails = (vendorName: string): ItemDetail[] => {
  const itemDatabase: Record<string, ItemDetail[]> = {
    "Porter Robinson": [
      { item: "ITM-001", name: "Samsung 980 Pro SSD", dateReceived: "2/1/2026", shippingDate: "2/5/2026", amount: 14500.00 },
      { item: "ITM-002", name: "WD Black SN850X", dateReceived: "2/1/2026", shippingDate: "2/5/2026", amount: 1900.00 },
      { item: "ITM-003", name: "Crucial P5 Plus", dateReceived: "2/2/2026", shippingDate: "2/6/2026", amount: 4200.00 },
    ],
    "Hikaru Utada": [
      { item: "ITM-004", name: "Corsair Vengeance 32GB", dateReceived: "2/2/2026", shippingDate: "2/6/2026", amount: 472500.00 },
      { item: "ITM-005", name: "G.Skill Trident Z5", dateReceived: "2/3/2026", shippingDate: "2/7/2026", amount: 523000.00 },
    ],
    "Kanye West": [
      { item: "ITM-006", name: "Intel i9-13900K", dateReceived: "2/3/2026", shippingDate: "2/7/2026", amount: 177500.00 },
      { item: "ITM-007", name: "AMD Ryzen 9 7950X", dateReceived: "2/4/2026", shippingDate: "2/8/2026", amount: 234000.00 },
    ],
    "Madeon": [
      { item: "ITM-008", name: "RTX 4090 Founders", dateReceived: "2/4/2026", shippingDate: "2/8/2026", amount: 105000.00 },
    ],
    "Daft Punk": [
      { item: "ITM-009", name: "ASUS ROG Strix Z790", dateReceived: "2/5/2026", shippingDate: "2/9/2026", amount: 25100.00 },
    ]
  }

  return itemDatabase[vendorName] || []
}

// Format currency to Philippine Peso
const formatPHP = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(amount)
}

const TABLE_COLUMNS = "80px 1.5fr 1.5fr 1.5fr 1.5fr 1.5fr"

export default function Vendordetailtab({ isOpen, onClose, vendor }: VendordetailtabProps) {
  if (!isOpen || !vendor) return null

  const items = getItemDetails(vendor.name)
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h2 className="text-lg font-bold" style={{color: '#000000'}}>Item Details</h2>
              <p className="text-sm text-gray-500">Supplier: {vendor.name} • {items.length} items</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase">Total Amount</p>
              <p className="text-lg font-bold text-green-600 flex items-center gap-1">
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

        {/* Horizontal Table */}
        <div className="flex-1 overflow-auto p-6">
          <div className="rounded-md border w-full">
            
            {/* Table Header */}
            <div className="flex items-center bg-muted px-4 py-3">
              <div 
                className="grid gap-4 text-xs font-semibold text-muted-foreground items-center flex-1"
                style={{ gridTemplateColumns: TABLE_COLUMNS }}
              >
                <span>Item</span>
                <span>Name</span>
                <span>Date Received</span>
                <span>Shipping Date</span>
                <span className="text-right">Amount (PHP)</span>
                <span className="text-center">Actions</span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              {items.map((item, index) => (
                <div 
                  key={item.item} 
                  className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div 
                    className="grid gap-4 items-center flex-1 text-sm"
                    style={{ gridTemplateColumns: TABLE_COLUMNS }}
                  >
                    {/* Item Code */}
                    <span className="font-mono text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded w-fit">
                      {item.item}
                    </span>
                    
                    {/* Name */}
                    <span className="font-medium text-gray-900">{item.name}</span>
                    
                    {/* Date Received */}
                    <span className="text-gray-600">{item.dateReceived}</span>
                    
                    {/* Shipping Date */}
                    <span className="text-gray-600">{item.shippingDate}</span>
                    
                    {/* Amount in PHP */}
                    <span className="font-medium text-gray-900 text-right flex items-center justify-end gap-1">
                      <PhilippinePeso className="w-3.5 h-3.5 text-gray-500" />
                      {item.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    
                    {/* Actions */}
                    <div className="flex justify-center gap-2">
                      <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Showing {items.length} items</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-black hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
              <ChevronRight className="w-4 h-4" />
              Process All
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
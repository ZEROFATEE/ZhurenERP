import * as React from "react"
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
  PhilippinePeso,
  Phone,
  MapPin,
  CreditCard,
  Mail
} from "lucide-react"

type Vendorlist = {
  id: number
  name: string
  dateReceived: string
  shippingDate: string
  amount: number
}

interface VendorInfo {
  contact: string
  mailingAddress: string
  account: string
  email: string
}

interface VendorDetail {
  qty: number    
  name: string       
  dateReceived: string
  shippingDate: string
  amount: number     
}

interface VendordetailtabProps {
  isOpen: boolean
  onClose: () => void
  vendor: Vendorlist | null
  onNavigateToInventory?: (tab: string, itemName?: string) => void  // Changed itemCode to itemName
}

const getVendorDetails = (vendorName: string): VendorDetail[] => {
  const itemDatabase: Record<string, VendorDetail[]> = {
    "Porter Robinson": [
      { qty: 5, name: "Samsung 980 Pro SSD", dateReceived: "2/1/2026", shippingDate: "2/5/2026", amount: 14500.00 },
      { qty: 3, name: "WD Black SN850X", dateReceived: "2/1/2026", shippingDate: "2/5/2026", amount: 1900.00 },
      { qty: 4, name: "Crucial P5 Plus", dateReceived: "2/2/2026", shippingDate: "2/6/2026", amount: 4200.00 },
    ],
    "Hikaru Utada": [
      { qty: 6, name: "Corsair Vengeance 32GB",  dateReceived: "2/2/2026", shippingDate: "2/6/2026", amount: 472500.00 },
      { qty: 7, name: "G.Skill Trident Z5", dateReceived: "2/3/2026", shippingDate: "2/7/2026", amount: 523000.00 },
    ],
    "Kanye West": [
      { qty: 2, name: "Intel i9-13900K",  dateReceived: "2/3/2026", shippingDate: "2/7/2026", amount: 177500.00 },
      { qty: 51, name: "AMD Ryzen 9 7950X", dateReceived: "2/4/2026", shippingDate: "2/8/2026", amount: 234000.00 },
    ],
  }

  return itemDatabase[vendorName] || []
}

// Get vendor contact information
const getVendorInfo = (vendorName: string): VendorInfo => {
  const vendorDatabase: Record<string, VendorInfo> = {
    "Porter Robinson": {
      contact: "+63 912 345 6789",
      mailingAddress: "123 Cyber Street, Makati City, Metro Manila",
      account: "ACC-2024-001",
      email: "porter.robinson@email.com"
    },
    "Hikaru Utada": {
      contact: "+63 923 456 7890",
      mailingAddress: "456 Tokyo Tower, Quezon City, Metro Manila",
      account: "ACC-2024-002",
      email: "hikaru.utada@email.com"
    },
    "Kanye West": {
      contact: "+63 934 567 8901",
      mailingAddress: "789 Chicago Ave, Pasig City, Metro Manila",
      account: "ACC-2024-003",
      email: "kanye.west@email.com"
    },
  }

  return vendorDatabase[vendorName] || {
    contact: "N/A",
    mailingAddress: "N/A",
    account: "N/A",
    email: "N/A"
  }
}

//  Philippine Peso brbrr
const formatPHP = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(amount)
}


const TABLE_COLUMNS = "80px 1.5fr 1.5fr 1.5fr 1.5fr"

const columns = [
  { key: 'qty', label: 'Qty', tab: 'stock' },
  { key: 'name', label: 'Name', tab: 'products' },
  { key: 'dateReceived', label: 'Date Received', tab: 'receiving' },
  { key: 'shippingDate', label: 'Shipping Date', tab: 'shipping' },
  { key: 'amount', label: 'Amount (PHP)', tab: 'finance' },
]

export default function Vendordetailtab({ 
  isOpen, 
  onClose, 
  vendor,
  onNavigateToInventory 
}: VendordetailtabProps) {
  if (!isOpen || !vendor) return null

  const items = getVendorDetails(vendor.name)
  const vendorInfo = getVendorInfo(vendor.name)
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0)

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleColumnClick = (tab: string, item: VendorDetail) => {
    console.log(`Navigating to ${tab} tab for item ${item.name}`)  // Changed from item.item to item.name
    onNavigateToInventory?.(tab, item.name)  // Pass name instead of item code
  }

  return (
    // Backdrop - click outside to close
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
  
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold" style={{color: '#000000'}}>Vendor Details</h2>
            <p className="text-sm text-gray-500 mb-3">
              Supplier: <span className="font-bold text-gray-900">{vendor.name}</span></p>
            <div className="grid grid-cols-4 gap-4 text-xs">
              <div className="flex items-start gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-500 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-gray-500 block">Contact</span>
                  <span className="font-medium text-gray-900">{vendorInfo.contact}</span>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-500 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-gray-500 block">Mailing Address</span>
                  <span className="font-medium text-gray-900 break-words">
                    {vendorInfo.mailingAddress}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-gray-500 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-gray-500 block">Account</span>
                  <span className="font-medium text-gray-900 font-mono">{vendorInfo.account}</span>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-500 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="text-gray-500 block">Email</span>
                  <span className="font-medium text-gray-900 break-all">
                    {vendorInfo.email}
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

        <div className="flex-1 overflow-auto p-6">
          <div className="rounded-md border w-full">

            <div className="flex items-center bg-muted px-4 py-3">
              <div 
                className="grid gap-4 text-xs font-semibold text-muted-foreground items-center flex-1"
                style={{ display: 'grid', gridTemplateColumns: TABLE_COLUMNS }}
              >
                {columns.map((col) => (
                  <span key={col.key} className={col.key === 'amount' ? 'text-right' : col.key === 'qty' ? 'text-center' : ''}>
                    {col.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {items.map((item, index) => (
                <div 
                  key={`${item.name}-${index}`}  // Changed from item.item to item.name
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
                      {item.dateReceived}
                    </button>
                    
                    <button
                      onClick={() => handleColumnClick('shipping', item)}
                      className="text-gray-600 text-left hover:text-blue-600 hover:underline transition-colors"
                    >
                      {item.shippingDate}
                    </button>
                    
                    <button
                      onClick={() => handleColumnClick('finance', item)}
                      className="font-medium text-gray-900 text-right flex items-center justify-end gap-1 hover:text-blue-600 hover:underline transition-colors"
                    >
                      <PhilippinePeso className="w-3.5 h-3.5 text-gray-500" />
                      {item.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Showing {items.length} orders • Total Qty: {totalQty}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
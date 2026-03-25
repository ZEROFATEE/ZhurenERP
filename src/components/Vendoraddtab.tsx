import * as React from "react"
import { X, Building2, Phone, MapPin, CreditCard, Mail } from "lucide-react"

interface VendoraddtabProps {
  isOpen: boolean
  onClose: () => void
}

export default function Vendoraddtab({ isOpen, onClose }: VendoraddtabProps) {
  if (!isOpen) return null

  const fields = [
    { label: "Vendor", icon: Building2, placeholder: "Company name", type: "text" },
    { label: "Contact #", icon: Phone, placeholder: "+1 (555) 000-0000", type: "tel" },
    { label: "Mailing Address", icon: MapPin, placeholder: "Street address", type: "text" },
    { label: "Account #", icon: CreditCard, placeholder: "ACC-000000", type: "text" },
    { label: "Email", icon: Mail, placeholder: "vendor@company.com", type: "email" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-black">Add New Vendor</h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-black hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-3 gap-x-6 gap-y-4">
            {fields.map((field) => (
              <div key={field.label} className="space-y-1.5">
                <label className="text-xs font-bold text-black flex items-center gap-1.5">
                  <field.icon className="w-3.5 h-3.5 text-black" />
                  {field.label}
                </label>
                <input 
                  type={field.type}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-black hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              Save Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
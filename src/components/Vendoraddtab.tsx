import * as React from "react"
import { X, Building2, Phone, MapPin, CreditCard, Mail } from "lucide-react"
import { createVendor, type Vendor } from "@/api/vendor"

interface VendoraddtabProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (vendor: Vendor) => void
}

export default function Vendoraddtab({ isOpen, onClose, onSave }: VendoraddtabProps) {
  if (!isOpen) return null

  const [formData, setFormData] = React.useState({
    name: "",
    contact: "",
    mailing_address: "",
    account: "",
    email: "",
    amount: "",
    shipping_date: "",
  })
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // NEW: Contact validation — numbers only, max 15 chars
  const handleContactChange = (value: string) => {
    // Remove all non-numeric characters except + and space (for +63 format)
    const cleaned = value.replace(/[^\d+ ]/g, '')
    // Limit to 15 characters max
    const limited = cleaned.slice(0, 15)
    setFormData(prev => ({ ...prev, contact: limited }))
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    // NEW: Validation checks
    if (!formData.name.trim()) {
      setError("Vendor name is required")
      setSaving(false)
      return
    }

    if (formData.contact && !/^[\d+ ]+$/.test(formData.contact)) {
      setError("Contact number must contain only numbers")
      setSaving(false)
      return
    }

    try {
      console.log("Sending vendor data:", {  // DEBUG: log what's being sent
        name: formData.name,
        contact: formData.contact,
        mailing_address: formData.mailing_address,
        account: formData.account,
        email: formData.email,
        amount: parseFloat(formData.amount) || 0,
        shipping_date: formData.shipping_date || undefined,
        date_received: new Date().toISOString().split('T')[0],
      })

      const newVendor = await createVendor({
        name: formData.name,
        contact: formData.contact,
        mailing_address: formData.mailing_address,
        account: formData.account,
        email: formData.email,
        amount: parseFloat(formData.amount) || 0,
        shipping_date: formData.shipping_date || undefined,
        date_received: new Date().toISOString().split('T')[0],
      })

      console.log("Vendor created:", newVendor)  // DEBUG: log success
      onSave?.(newVendor)
      setFormData({ name: "", contact: "", mailing_address: "", account: "", email: "", amount: "", shipping_date: "" })
      onClose()
    } catch (err: any) {
      console.error("Create vendor FULL error:", err)  // DEBUG: full error
      console.error("Response data:", err?.response?.data)  // DEBUG: server response
      setError(err?.response?.data?.error || err?.message || "Failed to save vendor. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-black">Add New Vendor</h2>
          <button onClick={onClose} className="p-1.5 text-black hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-x-6 gap-y-4">
            {[
              { label: "Vendor", icon: Building2, field: "name", placeholder: "Company name", type: "text", required: true },
              { label: "Contact #", icon: Phone, field: "contact", placeholder: "+63 912 345 6789", type: "tel", maxLength: 15 },
              { label: "Mailing Address", icon: MapPin, field: "mailing_address", placeholder: "Street address", type: "text" },
              { label: "Account #", icon: CreditCard, field: "account", placeholder: "ACC-000000", type: "text" },
              { label: "Email", icon: Mail, field: "email", placeholder: "vendor@company.com", type: "email" },
            ].map((f) => (
              <div key={f.field} className="space-y-1.5">
                <label className="text-xs font-bold text-black flex items-center gap-1.5">
                  <f.icon className="w-3.5 h-3.5 text-black" />
                  {f.label}
                  {f.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={f.type}
                  required={f.required}
                  maxLength={f.maxLength}
                  value={formData[f.field as keyof typeof formData]}
                  onChange={(e) => {
                    if (f.field === "contact") {
                      handleContactChange(e.target.value)  // NEW: special handler for contact
                    } else {
                      handleChange(f.field, e.target.value)
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder={f.placeholder}
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
              disabled={saving}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
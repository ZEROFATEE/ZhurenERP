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
  const [generatedAccount, setGeneratedAccount] = React.useState<string>("")
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Generate account number when modal opens
  React.useEffect(() => {
    if (isOpen) {
      generateAccountNumber().then(acc => {
        setGeneratedAccount(acc)
        setFormData(prev => ({ ...prev, account: acc }))
      })
    }
  }, [isOpen])

  // Contact: auto-prefix "+63" and numbers only
  const handleContactChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, '')
    const withoutPrefix = numbersOnly.startsWith('63') 
      ? numbersOnly.slice(2) 
      : numbersOnly
    const limited = withoutPrefix.slice(0, 10)
    const formatted = limited ? `+63${limited}` : ''
    setFormData(prev => ({ ...prev, contact: formatted }))
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Generate next account number: ACC-000001, ACC-000002, etc.
  const generateAccountNumber = async (): Promise<string> => {
    try {
      const response = await fetch('http://localhost:5000/api/vendors/count')
      const data = await response.json()
      console.log('Count response:', data)
      
      const currentCount = typeof data.count === 'number' ? data.count : parseInt(data.count) || 0
      const nextNumber = (currentCount + 1).toString().padStart(6, '0')
      const account = `ACC-${nextNumber}`
      console.log('Generated account:', account)
      return account
    } catch (err) {
      console.error('Failed to get count:', err)
      const fallback = Date.now().toString().slice(-6)
      return `ACC-${fallback}`
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (!formData.name.trim()) {
      setError("Vendor name is required")
      setSaving(false)
      return
    }

    try {
      const newVendor = await createVendor({
        name: formData.name,
        contact: formData.contact,
        mailing_address: formData.mailing_address,
        account: generatedAccount, // Use the pre-generated account
        email: formData.email,
        amount: parseFloat(formData.amount) || 0,
        shipping_date: formData.shipping_date || undefined,
        date_received: new Date().toISOString().split('T')[0],
      })
      onSave?.(newVendor)
      setFormData({ name: "", contact: "", mailing_address: "", account: "", email: "", amount: "", shipping_date: "" })
      setGeneratedAccount("")
      onClose()
    } catch (err: any) {
      console.error("Create vendor FULL error:", err)
      setError(err?.response?.data?.error || "Failed to save vendor. Please try again.")
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
            {/* Account # - Shows generated number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-black" />
                Account #
              </label>
              <input
                type="text"
                value={generatedAccount || "Generating..."}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 cursor-not-allowed font-mono"
              />
            </div>

            {/* Vendor Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-black" />
                Vendor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Company name"
              />
            </div>

            {/* Contact - auto +63 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-black" />
                Contact #
              </label>
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) => handleContactChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="+63 912 345 6789"
              />
            </div>

            {/* Mailing Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-black" />
                Mailing Address
              </label>
              <input
                type="text"
                value={formData.mailing_address}
                onChange={(e) => handleChange("mailing_address", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Street address"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-black" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="vendor@company.com"
              />
            </div>
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
              disabled={saving || !generatedAccount}
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
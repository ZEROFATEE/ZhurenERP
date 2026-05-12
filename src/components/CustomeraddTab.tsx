import * as React from "react"
import { X, User, Phone, MapPin, CreditCard, Mail, Building2 } from "lucide-react"
import { createVendor, type Vendor } from "@/api/vendor"

interface CustomerAddTabProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (customer: Vendor) => void
}

export default function CustomerAddTab({ isOpen, onClose, onSave }: CustomerAddTabProps) {
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

  // Account: auto-prefix "ACC-" and numbers only
  const handleAccountChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, '')
    const withoutPrefix = numbersOnly.startsWith('ACC') 
      ? numbersOnly.slice(3) 
      : numbersOnly
    const formatted = withoutPrefix ? `ACC-${withoutPrefix}` : ''
    setFormData(prev => ({ ...prev, account: formatted }))
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Generate next account number: ACC-000001, ACC-000002, etc.
  const generateAccountNumber = async (): Promise<string> => {
    try {
      const response = await fetch('http://localhost:5000/api/vendors/count')
      const data = await response.json()
      
      const currentCount = typeof data.count === 'number' ? data.count : parseInt(data.count) || 0
      const nextNumber = (currentCount + 1).toString().padStart(6, '0')
      return `ACC-${nextNumber}`
    } catch (err) {
      const fallback = Date.now().toString().slice(-6)
      return `ACC-${fallback}`
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (!formData.name.trim()) {
      setError("Customer name is required")
      setSaving(false)
      return
    }

    try {
      const newCustomer = await createVendor({
        name: formData.name,
        contact: formData.contact,
        mailing_address: formData.mailing_address,
        account: generatedAccount,
        email: formData.email,
        amount: parseFloat(formData.amount) || 0,
        shipping_date: formData.shipping_date || undefined,
        date_received: new Date().toISOString().split('T')[0],
      })
      onSave?.(newCustomer)
      resetForm()
      onClose()
    } catch (err: any) {
      console.error("Create customer FULL error:", err)
      setError(err?.response?.data?.error || "Failed to save customer. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      contact: "",
      mailing_address: "",
      account: "",
      email: "",
      amount: "",
      shipping_date: "",
    })
    setGeneratedAccount("")
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
  const disabledClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 cursor-not-allowed font-mono"
  const labelClass = "text-xs font-bold text-black flex items-center gap-1.5"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-black">Add New Customer</h2>
              <p className="text-sm text-gray-500">Enter customer details below</p>
            </div>
          </div>
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
            {/* Account # - Auto-generated */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                <CreditCard className="w-3.5 h-3.5 text-black" />
                Account #
              </label>
              <input
                type="text"
                value={generatedAccount || "Generating..."}
                disabled
                className={disabledClass}
              />
            </div>

            {/* Customer Name */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                <Building2 className="w-3.5 h-3.5 text-black" />
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={inputClass}
                placeholder="Customer name"
              />
            </div>

            {/* Contact - auto +63 */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                <Phone className="w-3.5 h-3.5 text-black" />
                Contact #
              </label>
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) => handleContactChange(e.target.value)}
                className={inputClass}
                placeholder="+63 912 345 6789"
              />
            </div>

            {/* Mailing Address */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                <MapPin className="w-3.5 h-3.5 text-black" />
                Mailing Address
              </label>
              <input
                type="text"
                value={formData.mailing_address}
                onChange={(e) => handleChange("mailing_address", e.target.value)}
                className={inputClass}
                placeholder="Street address"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                <Mail className="w-3.5 h-3.5 text-black" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={inputClass}
                placeholder="customer@email.com"
              />
            </div>

            {/* Opening Balance */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                <CreditCard className="w-3.5 h-3.5 text-black" />
                Opening Balance
              </label>
              <input
                type="number"
                min="0"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                className={inputClass}
                placeholder="0.00"
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
              {saving ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
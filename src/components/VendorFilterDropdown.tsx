import * as React from "react"
import { X, Check } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface FilterState {
  sortField: "name" | "amount" | "date_received" | "shipping_date" | ""
  sortOrder: "asc" | "desc"
  amountMin: string
  amountMax: string
  dateFrom: string
  dateTo: string
}

interface VendorFilterDropdownProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onApply: (filters: FilterState) => void
  onClear: () => void
}

const SORT_FIELDS = [
  { value: "name", label: "Vendor Name" },
  { value: "amount", label: "Amount" },
  { value: "date_received", label: "Date Received" },
  { value: "shipping_date", label: "Shipping Date" },
] as const

export default function VendorFilterDropdown({ isOpen, onClose, filters, onApply, onClear }: VendorFilterDropdownProps) {
  const [local, setLocal] = React.useState<FilterState>(filters)

  // Reset local when opening
  React.useEffect(() => {
    if (isOpen) setLocal(filters)
  }, [isOpen, filters])

  if (!isOpen) return null

  const hasActive = 
    local.sortField !== "" ||
    local.amountMin !== "" ||
    local.amountMax !== "" ||
    local.dateFrom !== "" ||
    local.dateTo !== ""

  const handleSortFieldChange = (value: string) => {
    setLocal(prev => ({
      ...prev,
      sortField: value as FilterState["sortField"]
    }))
  }

  const toggleSortOrder = () => {
    setLocal(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc"
    }))
  }

  const handleApply = () => {
    onApply(local)
    onClose()
  }

  const handleClear = () => {
    const cleared: FilterState = {
      sortField: "",
      sortOrder: "asc",
      amountMin: "",
      amountMax: "",
      dateFrom: "",
      dateTo: "",
    }
    setLocal(cleared)
    onClear()
    onClose()
  }

  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-1 py-1 border-b border-gray-100">
        <h3 className="text-sm font-bold text-black">Filter & Sort</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Sort Field Select */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Sort By</label>
          <Select value={local.sortField} onValueChange={handleSortFieldChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose field..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name">Vendor Name</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="date_received">Date Received</SelectItem>
                <SelectItem value="shipping_date">Shipping Date</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Asc/Desc Checkboxes */}
          {local.sortField && (
            <FieldGroup className="mt-2 space-y-2">
              <Field orientation="horizontal" className="flex items-center gap-2">
                <Checkbox 
                  id="sort-asc" 
                  checked={local.sortOrder === "asc"}
                  onCheckedChange={() => setLocal(prev => ({ ...prev, sortOrder: "asc" }))}
                />
                <FieldLabel htmlFor="sort-asc" className="text-sm text-gray-700 cursor-pointer">
                  Ascending (A → Z / Low → High)
                </FieldLabel>
              </Field>
              <Field orientation="horizontal" className="flex items-center gap-2">
                <Checkbox 
                  id="sort-desc" 
                  checked={local.sortOrder === "desc"}
                  onCheckedChange={() => setLocal(prev => ({ ...prev, sortOrder: "desc" }))}
                />
                <FieldLabel htmlFor="sort-desc" className="text-sm text-gray-700 cursor-pointer">
                  Descending (Z → A / High → Low)
                </FieldLabel>
              </Field>
            </FieldGroup>
          )}
        </div>

        {/* Amount Range */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Amount Range (₱)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={local.amountMin}
              onChange={(e) => setLocal(prev => ({ ...prev, amountMin: e.target.value }))}
              placeholder="Min"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <input
              type="number"
              value={local.amountMax}
              onChange={(e) => setLocal(prev => ({ ...prev, amountMax: e.target.value }))}
              placeholder="Max"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Date Range Checkboxes + Inputs */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Date Received</label>
          
          <FieldGroup className="space-y-3">
            <Field orientation="horizontal" className="flex items-center gap-2">
              <Checkbox 
                id="date-from-enabled" 
                checked={local.dateFrom !== ""}
                onCheckedChange={(checked) => 
                  setLocal(prev => ({ ...prev, dateFrom: checked ? new Date().toISOString().split('T')[0] : "" }))
                }
              />
              <FieldLabel htmlFor="date-from-enabled" className="text-sm text-gray-700 cursor-pointer">
                From date
              </FieldLabel>
            </Field>
            {local.dateFrom !== "" && (
              <input
                type="date"
                value={local.dateFrom}
                onChange={(e) => setLocal(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="w-full ml-6 border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            )}

            <Field orientation="horizontal" className="flex items-center gap-2">
              <Checkbox 
                id="date-to-enabled" 
                checked={local.dateTo !== ""}
                onCheckedChange={(checked) => 
                  setLocal(prev => ({ ...prev, dateTo: checked ? new Date().toISOString().split('T')[0] : "" }))
                }
              />
              <FieldLabel htmlFor="date-to-enabled" className="text-sm text-gray-700 cursor-pointer">
                To date
              </FieldLabel>
            </Field>
            {local.dateTo !== "" && (
              <input
                type="date"
                value={local.dateTo}
                onChange={(e) => setLocal(prev => ({ ...prev, dateTo: e.target.value }))}
                className="w-full ml-6 border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            )}
          </FieldGroup>
        </div>

        {/* Active Filters */}
        {hasActive && (
          <div className="p-3 bg-blue-50 rounded-lg space-y-2">
            <p className="text-xs font-semibold text-blue-700">Active:</p>
            <div className="flex flex-wrap gap-1.5">
              {local.sortField && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-white text-blue-700 rounded border border-blue-200">
                  {SORT_FIELDS.find(f => f.value === local.sortField)?.label} ({local.sortOrder})
                </span>
              )}
              {local.amountMin && (
                <span className="px-2 py-0.5 text-xs bg-white text-blue-700 rounded border border-blue-200">
                  Min ₱{local.amountMin}
                </span>
              )}
              {local.amountMax && (
                <span className="px-2 py-0.5 text-xs bg-white text-blue-700 rounded border border-blue-200">
                  Max ₱{local.amountMax}
                </span>
              )}
              {local.dateFrom && (
                <span className="px-2 py-0.5 text-xs bg-white text-blue-700 rounded border border-blue-200">
                  From {local.dateFrom}
                </span>
              )}
              {local.dateTo && (
                <span className="px-2 py-0.5 text-xs bg-white text-blue-700 rounded border border-blue-200">
                  To {local.dateTo}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <button
          onClick={handleClear}
          className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          Reset
        </button>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
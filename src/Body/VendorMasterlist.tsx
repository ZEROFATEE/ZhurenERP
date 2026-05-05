import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter, SlidersHorizontal } from "lucide-react"
import Vendorlist from "@/components/VendorList"
import Vendoraddtab from "@/components/Vendoraddtab"
import Vendordetailtab from "@/components/Vendordetailtab"
import VendorFilterDropdown, { type FilterState } from "@/components/VendorFilterDropdown"
import { getVendors, deleteVendor, type Vendor } from "@/api/vendor"

interface VendorMasterlistProps {
  isSidebarMinimized?: boolean
}

export default function VendorMasterlist({ isSidebarMinimized = false }: VendorMasterlistProps) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [filtered, setFiltered] = useState<Vendor[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  
  const filterRef = useRef<HTMLDivElement>(null)
  
  const [filters, setFilters] = useState<FilterState>({
    sortField: "",
    sortOrder: "asc",
    amountMin: "",
    amountMax: "",
    dateFrom: "",
    dateTo: "",
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getVendors()
      setVendors(data)
      setFiltered(data)
    } catch (err) {
      setError("Failed to load vendors. Is the server running?")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  // Apply search + filters + sort
  useEffect(() => {
    let result = [...vendors]
    
    // Text search
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q) ||
        v.account?.toLowerCase().includes(q)
      )
    }
    
    // Amount range
    if (filters.amountMin) {
      result = result.filter(v => Number(v.amount) >= parseFloat(filters.amountMin))
    }
    if (filters.amountMax) {
      result = result.filter(v => Number(v.amount) <= parseFloat(filters.amountMax))
    }
    
    // Date range
    if (filters.dateFrom) {
      result = result.filter(v => v.date_received && new Date(v.date_received) >= new Date(filters.dateFrom))
    }
    if (filters.dateTo) {
      result = result.filter(v => v.date_received && new Date(v.date_received) <= new Date(filters.dateTo))
    }
    
    // Sort
    if (filters.sortField) {
      result.sort((a, b) => {
        let comparison = 0
        switch (filters.sortField) {
          case "name":
            comparison = a.name.localeCompare(b.name)
            break
          case "amount":
            comparison = Number(a.amount) - Number(b.amount)
            break
          case "date_received":
            comparison = new Date(a.date_received || 0).getTime() - new Date(b.date_received || 0).getTime()
            break
          case "shipping_date":
            comparison = new Date(a.shipping_date || 0).getTime() - new Date(b.shipping_date || 0).getTime()
            break
        }
        return filters.sortOrder === "asc" ? comparison : -comparison
      })
    }
    
    setFiltered(result)
  }, [search, vendors, filters])

  const handleExpand = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false)
    setSelectedVendor(null)
  }

  const handleVendorSaved = (newVendor: Vendor) => {
    setVendors(prev => [newVendor, ...prev])
    setIsAddModalOpen(false)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteVendor(id)
      setVendors(prev => prev.filter(v => v.id !== id))
    } catch (err) {
      console.error("Failed to delete vendor:", err)
      alert("Failed to delete vendor. Check console.")
    }
  }

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      sortField: "",
      sortOrder: "asc",
      amountMin: "",
      amountMax: "",
      dateFrom: "",
      dateTo: "",
    })
  }

  const hasActiveFilters = 
    filters.sortField !== "" ||
    filters.amountMin !== "" ||
    filters.amountMax !== "" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== ""

  return (
    <div className="min-h-screen bg-white">
      <Vendoraddtab
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleVendorSaved}
      />

      <Vendordetailtab
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        vendor={selectedVendor}
      />

      <div className={`p-6 mx-auto transition-all duration-300 ${isSidebarMinimized ? "max-w-7xl" : "max-w-5xl"}`}>
        {/* Search & Buttons Row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2 h-10 text-sm text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg placeholder:text-gray-500"
            />
          </div>

          <div className="flex-1" />

          {/* Filter Button with Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-1.5 px-3 py-2 h-10 text-sm font-bold border rounded-lg transition-colors shadow-sm ${
                hasActiveFilters
                  ? "text-blue-700 bg-blue-50 border-blue-300"
                  : "text-black bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
              {hasActiveFilters && <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full" />}
            </button>

            {/* Dropdown Panel */}
            <VendorFilterDropdown
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filters={filters}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 h-10 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>

        {/* Results count */}
        <div className="mb-2 text-sm text-gray-500">
          Showing {filtered.length} of {vendors.length} vendors
          {hasActiveFilters && " • Filtered"}
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-500 text-sm">Loading vendors...</div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500 text-sm">{error}</div>
        )}
        {!loading && !error && (
          <Vendorlist 
            data={filtered} 
            onExpand={handleExpand} 
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}
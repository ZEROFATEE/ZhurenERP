import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter } from "lucide-react"
import Vendorlist from "@/components/VendorList"
import Vendoraddtab from "@/components/Vendoraddtab"
import Vendordetailtab from "@/components/Vendordetailtab"
import { getVendors, type Vendor } from "@/api/vendor"

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
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)

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

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      vendors.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q) ||
        v.account?.toLowerCase().includes(q)
      )
    )
  }, [search, vendors])

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

          <button className="flex items-center gap-1.5 px-3 py-2 h-10 text-sm font-bold text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 h-10 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-500 text-sm">Loading vendors...</div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500 text-sm">{error}</div>
        )}
        {!loading && !error && (
          <Vendorlist data={filtered} onExpand={handleExpand} />
        )}
      </div>
    </div>
  )
}
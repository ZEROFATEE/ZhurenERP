import { useState, useEffect } from "react";
import Purchase from "@/components/Purchase";
import PurchaseDetailTab from "@/components/PurchaseDetailTab";
import PurchaseAddTab from "@/components/PurchaseAddTab";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Search, Plus, Filter } from "lucide-react"
import { getPurchases, updatePurchase, deletePurchase, type Purchase as PurchaseType } from "@/api/purchases"


export default function Purchases() {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<PurchaseType | null>(null)
  const [purchaseData, setPurchaseData] = useState<PurchaseType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  // Fetch from database on mount
  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPurchases()
      setPurchaseData(data)
    } catch (err) {
      setError("Failed to load purchases. Is the server running?")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleExpand = (item: PurchaseType) => {
    setSelectedItem(item)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false)
    setSelectedItem(null)
  }

  const handleCloseAdd = () => {
    setIsAddModalOpen(false)
  }

  // Update status in database
  const handleStatusUpdate = async (purchaseId: number, newStatus: PurchaseType["status"]) => {
    try {
      await updatePurchase(purchaseId, { status: newStatus })
      setPurchaseData(prev => prev.map(p => 
        p.id === purchaseId ? { ...p, status: newStatus } : p
      ))
    } catch (err) {
      console.error("Failed to update status:", err)
      alert("Failed to update status")
    }
  }

  // Add new purchase (refresh list after)
 // After
const handleAddPurchase = (_purchase: PurchaseType) => {
  fetchPurchases().catch(err => console.error("Failed to refresh after add:", err))
  setIsAddModalOpen(false)
}

  // Delete purchase  
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this purchase?")) return
    try {
      await deletePurchase(id)
      setPurchaseData(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error("Failed to delete:", err)
      alert("Failed to delete purchase")
    }
  }

  // Filter by search
  const filteredData = search
    ? purchaseData.filter(p => 
        p.item.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      )
    : purchaseData

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Detail Modal */}
      <PurchaseDetailTab 
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        item={selectedItem}
        onStatusChange={handleStatusUpdate}
      />

      {/* Add New Modal */}
      <PurchaseAddTab
        isOpen={isAddModalOpen}
        onClose={handleCloseAdd}
        onSave={handleAddPurchase}
      />

      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <InputGroup className="max-w-xs">
          <InputGroupInput 
            placeholder="Search..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search className="w-4 h-4 text-black" />
          </InputGroupAddon>
        </InputGroup>

        <div className="flex items-center gap-2">
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
      </div>

      {/* Loading / Error / Data */}
      {loading && (
        <div className="text-center py-12 text-gray-500">Loading purchases...</div>
      )}
      {error && (
        <div className="text-center py-12 text-red-500">{error}</div>
      )}
      {!loading && !error && (
        <Purchase 
          data={filteredData}
          onExpand={handleExpand}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
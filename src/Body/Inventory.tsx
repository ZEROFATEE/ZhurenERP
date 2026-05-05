import { useState, useEffect } from "react"
import InventoryList from "@/components/InventoryList"
import InventoryDetailTab from "@/components/InventoryDetailTab"
import InventoryAddTab from "@/components/InventoryAddTab"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Search, Plus, Filter } from "lucide-react"

// ✅ FIX 1: Import the REAL Inventory type and API functions — remove local type and mock data entirely
import { type Inventory, getInventories, deleteInventory } from "@/api/inventory"

export default function InventoryPage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null)
  const [inventoryData, setInventoryData] = useState<Inventory[]>([])  // ✅ FIX 2: Start empty, not mock data
  const [loading, setLoading] = useState(true)   // ✅ FIX 3: Loading state while fetching
  const [error, setError] = useState<string | null>(null)

  // ✅ FIX 4: Actually fetch from the API on mount
  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getInventories()
      setInventoryData(data)
    } catch (err) {
      console.error("Failed to fetch inventory:", err)
      setError("Failed to load inventory. Is the server running?")
    } finally {
      setLoading(false)
    }
  }

  const handleExpand = (item: Inventory) => {
    setSelectedItem(item)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedItem(null)
  }

  const handleCloseAdd = () => {
    setIsAddOpen(false)
  }

  // ✅ FIX 5: onSave receives the real Inventory object back from the API
  const handleAddInventory = (newItem: Inventory) => {
    setInventoryData(prev => [...prev, newItem])  // id comes from server, not prev.length + 1
    setIsAddOpen(false)
  }

  // ✅ FIX 6: Delete actually calls the API
  const handleDelete = async (id: number) => {
    try {
      await deleteInventory(id)
      setInventoryData(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error("Failed to delete inventory item:", err)
      alert("Failed to delete item. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <InventoryDetailTab
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        item={selectedItem}
      />

      <InventoryAddTab
        isOpen={isAddOpen}
        onClose={handleCloseAdd}
        onSave={handleAddInventory}
      />

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2" />
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>
        </div>

        <div className="mb-4 max-w-xs">
          <InputGroup>
            <InputGroupAddon>
              <Search className="w-4 h-4 text-black" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search items..." />
          </InputGroup>
        </div>

        {/* ✅ FIX 7: Show loading/error states, then the real list */}
        {loading ? (
          <div className="rounded-md border w-full p-8 text-center text-gray-400 text-sm">
            Loading inventory...
          </div>
        ) : error ? (
          <div className="rounded-md border w-full p-8 text-center text-red-500 text-sm">
            {error}
          </div>
        ) : (
          <InventoryList
            data={inventoryData}
            onExpand={handleExpand}
            onDelete={handleDelete}  // ✅ FIX 8: Pass delete handler
          />
        )}
      </div>
    </div>
  )
}
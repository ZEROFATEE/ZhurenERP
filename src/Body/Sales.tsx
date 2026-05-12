import * as React from "react"
import SalesList from "@/components/SalesList"
import SalesAddTab from "@/components/SalesAddTab"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Search, Plus } from "lucide-react"

export default function Sales() {
  const [search, setSearch] = React.useState("")
  const [isAddOpen, setIsAddOpen] = React.useState(false)

  const handleSaleSaved = (sale: any) => {
    // Refresh your sales list or update state
    console.log("Sale completed:", sale)
    // TODO: Add to your sales state or refetch
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex items-center gap-3">
          <InputGroup className="max-w-xs">
            <InputGroupAddon>
              <Search className="w-4 h-4 text-black" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search by serial #, item code, or name..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>

        {/* Add Sale Button */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Sale
        </button>
      </div>

      <SalesAddTab
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleSaleSaved}
      />

      <SalesList search={search} />
    </div>
  )
}
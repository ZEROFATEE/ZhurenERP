import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getAvailableItems, type SaleableItem } from "@/api/sales"
import { User } from "lucide-react"

const COLUMN_TEMPLATE = "140px 2fr 1.5fr 1.5fr 1fr 110px 110px"

interface SalesListProps {
  search: string
}

export default function SalesList({ search }: SalesListProps) {
  const [items, setItems] = React.useState<SaleableItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    getAvailableItems()
      .then(setItems)
      .catch(() => setError("Failed to load items. Is the server running?"))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(item => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      item.serial_number?.toLowerCase().includes(q) ||
      item.item.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.item_class?.toLowerCase().includes(q) ||
      item.customer_name?.toLowerCase().includes(q)
    )
  })

  if (loading) return (
    <div className="rounded-md border w-full p-8 text-center text-gray-400 text-sm">
      Loading inventory...
    </div>
  )

  if (error) return (
    <div className="rounded-md border w-full p-8 text-center text-red-500 text-sm">
      {error}
    </div>
  )

  return (
    <div className="rounded-md border w-full">
      <div
        className="px-4 py-2 text-xs font-semibold text-black bg-muted rounded-t-md"
        style={{ display: "grid", gridTemplateColumns: COLUMN_TEMPLATE }}
      >
        <span>Serial #</span>
        <span>Item Name</span>
        <span>Customer</span>
        <span>Class</span>
        <span className="text-center">Tax Type</span>
        <span className="text-right">Price Level</span>
        <span className="text-right">Amount</span>
      </div>
      <Separator />

      <ScrollArea className="h-[510px]">
        <div className="p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              {search.trim()
                ? `No items found for "${search}"`
                : "No received inventory items available."}
            </div>
          ) : (
            filtered.map((item) => (
              <React.Fragment key={item.id}>
                <div
                  className="px-2 py-3 text-sm items-center hover:bg-muted/50 rounded-md transition-colors"
                  style={{ display: "grid", gridTemplateColumns: COLUMN_TEMPLATE }}
                >
                  {/* Serial # */}
                  <div className="min-w-0">
                    <div className="font-mono font-medium text-black text-xs">
                      {item.serial_number || "No serial"}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {item.item}
                    </div>
                  </div>

                  {/* Item Name */}
                  <div className="min-w-0">
                    <div className="font-medium text-black truncate">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-400 truncate">{item.description}</div>
                    )}
                  </div>

                  {/* ✅ NEW: Customer Column */}
                  <div className="min-w-0">
                    {item.customer_name ? (
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-blue-500" />
                        <div>
                          <div className="font-medium text-black text-xs truncate">
                            {item.customer_name}
                          </div>
                          {item.date_sold && (
                            <div className="text-xs text-gray-400">
                              {new Date(item.date_sold).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-xs">Not sold</span>
                    )}
                  </div>

                  {/* Item Class */}
                  <span className="text-black truncate">
                    {item.item_class && item.item_class.trim() !== ""
                      ? item.item_class
                      : <span className="text-gray-400 italic">No class</span>
                    }
                  </span>

                  {/* Tax Type */}
                  <span className="text-black text-center">
                    {item.item_tax_type === "1" ? "Taxable" : "Exempt"}
                  </span>

                  {/* Price Level */}
                  <span className="text-black text-right">
                    ₱{Number(item.price_level).toLocaleString()}
                  </span>

                  {/* Amount */}
                  <span className="font-medium text-black text-right">
                    ₱{Number(item.amount).toLocaleString()}
                  </span>
                </div>
                <Separator />
              </React.Fragment>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400">
        {filtered.length} item{filtered.length !== 1 ? "s" : ""} available
        {search.trim() ? ` matching "${search}"` : " in stock"}
      </div>
    </div>
  )
}
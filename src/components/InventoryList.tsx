import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Maximize2, Trash2 } from "lucide-react"
import type { Inventory } from "@/api/inventory"

const statusColors: Record<Inventory["status"], string> = {
  Received: "bg-green-100 text-green-700 border-green-200",
  NotReceived: "bg-red-100 text-red-700 border-red-200",
}

const COLUMN_TEMPLATE = "2fr 2fr 1.5fr 100px 100px 200px 140px"

interface InventoryListProps {
  data: Inventory[]
  onExpand: (item: Inventory) => void
  onDelete?: (id: number) => void
}

export default function InventoryList({ data, onExpand, onDelete }: InventoryListProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-md border w-full p-8 text-center text-gray-400 text-sm">
        No inventory data available
      </div>
    )
  }

  return (
    <div className="rounded-md border w-full">
      {/* Header Row */}
      <div
        className="flex items-center gap-4 px-4 py-2 text-xs font-semibold text-black bg-muted rounded-t-md"
        style={{ display: "grid", gridTemplateColumns: COLUMN_TEMPLATE }}
      >
        <span>Item #</span>
        <span>Item Name</span>
        <span>Description</span>
        <span className="text-right">Price Level</span>
        <span className="text-right">Amount</span>
        <span className="text-center">Status / Dates</span>
        <span className="text-center">Actions</span>
      </div>
      <Separator />

      <ScrollArea className="h-[510px]">
        <div className="p-2">
          {data.map((inventory) => (
            <React.Fragment key={inventory.id}>
              <div
                className="flex items-center gap-4 px-2 py-3 text-sm hover:bg-muted/50 rounded-md transition-colors"
                style={{ display: "grid", gridTemplateColumns: COLUMN_TEMPLATE }}
              >
                {/* Item # */}
                <span className="font-medium text-black truncate" title={inventory.item}>
                  {inventory.item}
                </span>

                {/* Item Name */}
                <span className="font-medium text-black truncate" title={inventory.name}>
                  {inventory.name || "—"}
                </span>

                {/* Description */}
                <span className="text-black truncate" title={inventory.description || ""}>
                  {inventory.description || "—"}
                </span>

                {/* Price Level */}
                <span className="text-black text-right">
                  ₱{Number(inventory.price_level).toLocaleString()}
                </span>

                {/* Amount */}
                <span className="font-medium text-black text-right">
                  ₱{Number(inventory.amount).toLocaleString()}
                </span>

                {/* Status + Dates */}
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[inventory.status]}`}
                  >
                    {inventory.status === "NotReceived" ? "Not Received" : inventory.status}
                  </span>
                  <div className="text-xs text-black text-center leading-tight">
                    <div>
                      Ship:{" "}
                      {inventory.shipping_date
                        ? new Date(inventory.shipping_date).toLocaleDateString()
                        : "—"}
                    </div>
                    <div className={inventory.date_received ? "" : "text-gray-400 italic"}>
                      Recv:{" "}
                      {inventory.date_received
                        ? new Date(inventory.date_received).toLocaleDateString()
                        : "—"}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-1">
                  <button
                    onClick={() => onExpand(inventory)}
                    className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Expand
                  </button>
                  <button
                    onClick={() => onDelete?.(inventory.id)}
                    className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Del
                  </button>
                </div>
              </div>
              <Separator />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
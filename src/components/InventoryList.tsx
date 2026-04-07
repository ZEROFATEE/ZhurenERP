import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Maximize2 } from "lucide-react"

type Inventory = {
  id: number
  item: string
  name: string
  dateReceived: string
  shippingDate: string  // Changed from shipping
  amount: number
  status: "Received" | "NotReceived"
}

const statusColors: Record<Inventory["status"], string> = {
  Received: "bg-green-100 text-green-700",
  NotReceived: "bg-yellow-100 text-yellow-700",
}

const VIEW_COLUMNS = "40px 1fr 2fr 1fr 1fr 1fr 100px"

interface InventoryListProps {
  data: Inventory[]
  onExpand: (item: Inventory) => void
}

export default function InventoryList({ data, onExpand }: InventoryListProps) {
  return (
    <div className="rounded-md border w-full">
      {/* Header */}
      <div className="flex items-center bg-muted rounded-t-md px-4 py-2">
        <div 
          className="grid gap-2 text-xs font-semibold text-black items-center flex-1"
          style={{ gridTemplateColumns: VIEW_COLUMNS }}
        >
          <span>#</span>
          <span>Item</span>
          <span>Name</span>
          <span>Date Received</span>
          <span>Shipping Date</span>  
          <span>Amount</span>
          <span className="text-center">Actions</span>
        </div>
      </div>

      <Separator />

      {/* Rows */}
      <ScrollArea className="h-[510px]">
        <div className="p-2">
          {data.map((inv) => (
            <React.Fragment key={inv.id}>
              <div className="flex items-center px-2 py-3 text-sm hover:bg-muted/50 rounded-md transition-colors">
                <div 
                  className="grid gap-2 items-center flex-1 text-black"
                  style={{ gridTemplateColumns: VIEW_COLUMNS }}
                >
                  <span>{inv.id}</span>
                  <span className="font-medium">{inv.item}</span>
                  <span>{inv.name}</span>
                  <span>{inv.dateReceived}</span>
                  <span>{inv.shippingDate}</span>  {/* Changed from shipping */}
                  <span className="font-medium">${inv.amount.toLocaleString()}</span>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={() => onExpand(inv)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      Expand
                    </button>
                  </div>
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
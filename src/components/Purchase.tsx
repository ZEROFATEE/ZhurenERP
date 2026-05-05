import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Maximize2, Trash2 } from "lucide-react"
import type { Purchase } from "@/api/purchases"

const statusColors: Record<Purchase["status"], string> = {
  Received: "bg-green-100 text-green-700 border-green-200",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  NotReceived: "bg-red-100 text-red-700 border-red-200",
}

const COLUMN_TEMPLATE = "60px 2fr 2fr 100px 100px 280px 140px"

interface PurchaseProps {
  data: Purchase[]
  onExpand: (item: Purchase) => void
  onDelete?: (id: number) => void
}

export default function PurchaseList({ data, onExpand, onDelete }: PurchaseProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-md border w-full p-8 text-center text-gray-400 text-sm">
        No purchase data available
      </div>
    )
  }

  return (
    <div className="rounded-md border w-full">
      <div 
        className="flex items-center gap-4 px-4 py-2 text-xs font-semibold text-black bg-muted rounded-t-md"
        style={{ display: 'grid', gridTemplateColumns: COLUMN_TEMPLATE }}
      >
        <span>Qty</span>
        <span>Item</span>
        <span>Description</span>
        <span className="text-right">Unit Price</span>
        <span className="text-right">Amount</span>
        <span className="text-center">Status / Dates</span>
        <span className="text-center">Actions</span>
      </div>
      <Separator />

      <ScrollArea className="h-[510px]">
        <div className="p-2">
          {data.map((purchase) => (
            <React.Fragment key={purchase.id}>
              <div 
                className="flex items-center gap-4 px-2 py-3 text-sm hover:bg-muted/50 rounded-md transition-colors"
                style={{ display: 'grid', gridTemplateColumns: COLUMN_TEMPLATE }}
              >
                <span className="font-medium text-black">{purchase.qty}</span>
                <span className="font-medium text-black truncate" title={purchase.item}>
                  {purchase.item}
                </span>
                <span className="text-black truncate" title={purchase.description || ""}>
                  {purchase.description || "—"}
                </span>
                <span className="text-black text-right">
                  ₱{Number(purchase.unit_price).toLocaleString()}
                </span>
                <span className="font-medium text-black text-right">
                  ₱{Number(purchase.amount).toLocaleString()}
                </span>
                
                <div className="flex flex-col items-center gap-1">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[purchase.status]}`}>
                    {purchase.status}
                  </span>
                  <div className="text-xs text-black text-center leading-tight">
                    <div>Ship: {purchase.shipment_date ? new Date(purchase.shipment_date).toLocaleDateString() : "—"}</div>
                    <div className={purchase.received_date ? '' : 'text-gray-400 italic'}>
                      Recv: {purchase.received_date ? new Date(purchase.received_date).toLocaleDateString() : "—"}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-1">
                  <button
                    onClick={() => onExpand(purchase)}
                    className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Expand
                  </button>
                  <button
                    onClick={() => onDelete?.(purchase.id)}
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
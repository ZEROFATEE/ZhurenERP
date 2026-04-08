import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Maximize2 } from "lucide-react"

type Purchase = {
  id: number
  qty: number
  item: string
  desc: string
  unitprice: number
  amount: number
  total: number
  shipmentDate: string
  receivedDate?: string
  status: "Received" | "Pending" | "NotReceived"
}

const statusColors: Record<Purchase["status"], string> = {
  Received: "bg-green-100 text-green-700 border-green-200",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  NotReceived: "bg-red-100 text-red-700 border-red-200",
}

const COLUMN_TEMPLATE = "60px 1.5fr 1.5fr 100px 100px 100px 100px 100px 100px"

interface PurchaseProps {
  data: Purchase[]
  onExpand: (item: Purchase) => void
}

export default function Purchase({ data, onExpand }: PurchaseProps) {
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
        <span className="text-center">Shipment Date</span>
        <span className="text-center">Received Date</span>
        <span className="text-center">Status</span>
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
                <span className="text-black truncate" title={purchase.desc}>
                  {purchase.desc}
                </span>
                <span className="text-black text-right">₱{purchase.unitprice.toLocaleString()}</span>
                <span className="font-medium text-black text-right">₱{purchase.amount.toLocaleString()}</span>
                
                <span className="text-black text-center">
                  {purchase.shipmentDate}
                </span>
                
                <span className={`text-center ${purchase.receivedDate ? 'text-black' : 'text-gray-400 italic'}`}>
                  {purchase.receivedDate || "—"}
                </span>
                
                <div className="flex justify-center">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[purchase.status]}`}>
                    {purchase.status}
                  </span>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => onExpand(purchase)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
                    title="View purchase details"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Expand
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
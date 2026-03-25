import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type Inventory = {
  id: number
  item: string
  qty: number
  desc: string
  unitpri: number
  status: "Received" | "NotReceived"
}

const mockInventory: Inventory[] = [
  {id: 1, item: "SSD", qty:67, desc:"1TB SSD", unitpri: 67, status: "Received"},
]

const statusColors: Record<Inventory["status"], string> = {
  Received: "bg-green-100 text-green-700",
  NotReceived: "bg-yellow-100 text-yellow-700",
} 



export default function InventoryList() {
  return (
    <div className="rounded-md border">
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted rounded-t-md">
        <span>Item</span>
       {/* <span>#</span> */}
        <span>Quantity</span>
        <span>Description</span>
        <span>Unit Price</span>
        <span>Status</span>
      </div>
      <Separator />

      <ScrollArea className="h-[510px]">
        <div className="p-2">
          {mockInventory.map((inv) => (
            <React.Fragment key={inv.id}>
                <span>{inv.item}</span>
                <span>{inv.qty}</span>
                <span>{inv.desc}</span>
                <span>{inv.unitpri}</span>
                <div className="grid grid-cols-6 gap-4 px-2 py-3 text-sm items-center hover:bg-muted/50 rounded-md transition-colors">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[inv.status]}`}>
                {inv.status}
                </span>
        </div>
        <Separator />
        </React.Fragment>
        ))}
    </div>
    </ScrollArea>
  </div>
  )
}
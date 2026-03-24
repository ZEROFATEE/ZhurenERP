import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type Purchase = {
  id: number
  status: "Paid" | "Pending" | "Cancelled" 
}
// temporary chuchu
const mockPurchase: Purchase[] = [
  {id: 1, status: "Paid"},
]

const statusColors: Record<Purchase["status"], string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
} 



export default function SalesList() {
  return (
    <div className="rounded-md border">
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted rounded-t-md">
       {/* <span>#</span> */}
        <span>Quantity</span>
        <span>Item</span>
        <span>Description</span>
        <span>Unit Price</span>
        <span>Amount</span>
        <span>Total</span>
      </div>
      <Separator />

      <ScrollArea className="h-[510px]">
        <div className="p-2">
          {mockPurchase.map((purchase) => (
            <React.Fragment key={purchase.id}>
              <div className="grid grid-cols-6 gap-4 px-2 py-3 text-sm items-center hover:bg-muted/50 rounded-md transition-colors">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[purchase.status]}`}>
                    {purchase.status}
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
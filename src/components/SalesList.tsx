import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type Sale = {
  id: number
  Qty: number
  item: number
  description: number
  unitprice: number
  amount: string
 /* status: "Paid" | "Pending" | "Cancelled" */
}
// temporary chuchu
const mockSales: Sale[] = [
  { id: 1, Qty: 21, item: 676767, description: 1, unitprice: 45000, amount: "2025-03-01"},
]

/* const statusColors: Record<Sale["status"], string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
} */

export default function SalesList() {
  return (
    <div className="rounded-md border">
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted rounded-t-md">
        <span>#</span>
        <span>Customer</span>
        <span>Item</span>
        <span>Qty</span>
        <span>Amount</span>
        <span>Status</span>
      </div>
      <Separator />

      <ScrollArea className="h-[510px]">
        <div className="p-2">
          {mockSales.map((sale) => (
            <React.Fragment key={sale.id}>
              <div className="grid grid-cols-6 gap-4 px-2 py-3 text-sm items-center hover:bg-muted/50 rounded-md transition-colors">
                <span className="text-muted-foreground">{sale.id}</span>
                <span className="font-medium truncate">{sale.Qty}</span>
                <span className="truncate">{sale.item}</span>
                <span>{sale.description}</span>
                <span>{sale.unitprice}</span>
                <span>{sale.amount}</span>
              </div>
              <Separator />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/scroll-area"

type Purchase = {
  id: number
  qty: number        // Added: quantity
  item: string
  desc: string
  unitprice: number
  amount: number
  total: number
  status: "Received" | "NotReceived"
}

// Updated mock data with qty field
const mockPurchase: Purchase[] = [
  {id: 1, qty: 5, item: "SAMSUNG SSD 870 EVO", desc: "1TB SSD", unitprice: 2900, amount: 14500, total: 15500, status: "Received"},
  {id: 2, qty: 3, item: "Corsair RAM DDR5", desc: "32GB 5600MHz", unitprice: 4800, amount: 14400, total: 15400, status: "NotReceived"},
  {id: 3, qty: 2, item: "Intel i9-13900K", desc: "24 Core Processor", unitprice: 32000, amount: 64000, total: 65000, status: "Received"},
]

const statusColors: Record<Purchase["status"], string> = {
  Received: "bg-green-100 text-green-700",
  NotReceived: "bg-yellow-100 text-yellow-700",
} 

export default function SalesList() {
  return (
    <div className="rounded-md border w-full">
      {/* Header */}
      <div className="grid grid-cols-7 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted rounded-t-md items-center">
        <span>#</span>
        <span>Qty</span>
        <span>Item</span>
        <span>Description</span>
        <span>Unit Price</span>
        <span>Amount</span>
        <span>Status</span>
      </div>
      <Separator />

      <ScrollArea className="h-[510px]">
        <div className="p-2">
          {mockPurchase.map((purchase) => (
            <React.Fragment key={purchase.id}>
              <div className="grid grid-cols-7 gap-4 px-2 py-3 text-sm items-center hover:bg-muted/50 rounded-md transition-colors">
                <span className="text-muted-foreground">{purchase.id}</span>
                
                {/* Quantity */}
                <span className="font-medium">{purchase.qty}</span>
                
                {/* Item */}
                <span className="font-medium text-gray-900">{purchase.item}</span>
                
                {/* Description */}
                <span className="text-gray-600 truncate">{purchase.desc}</span>
                
                {/* Unit Price - formatted as PHP */}
                <span className="text-gray-600">₱{purchase.unitprice.toLocaleString()}</span>
                
                {/* Amount - formatted as PHP */}
                <span className="font-medium">₱{purchase.amount.toLocaleString()}</span>
                
                {/* Status with color badge */}
                <span className={`inline-flex w-fit px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[purchase.status]}`}>
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
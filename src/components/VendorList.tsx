import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type Vendorlist = {
  id: number
  date: string
  description: string
  quatity: number
  amount: number
  status: "Paid" | "Pending" | "Cancelled" 
}

const vendorList: Vendorlist[] = [
  { id: 1, date: "2/2/2026", description: "desc", quatity: 67, amount: 67, status: "Paid"},
]

const statusColors: Record<Vendorlist["status"], string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
} 

export default function Vendorlist() {
  return (
    <div className="rounded-md border">
    <div className="grid grid-cols-6 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted rounded-t-md">
        <span>#</span>
        <span>Date</span>
        <span>Description</span>
        <span>Quantity</span>
        <span>Amount</span>
        <span>Status</span>
      </div>
      <Separator />

      <ScrollArea className="h-[510px]">
        <div className="p-2">
          {vendorList.map((vendor) => (
            <React.Fragment key={vendor.id}>
              <div className="grid grid-cols-6 gap-4 px-2 py-3 text-sm items-center hover:bg-muted/50 rounded-md transition-colors">
                <span className="text-muted-foreground">{vendor.id}</span>
                <span>{vendor.date}</span>
                <span>{vendor.description}</span>
                <span className="font-medium truncate">{vendor.quatity}</span>
                <span>{vendor.amount}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[vendor.status]}`}>{vendor.status}</span>
              </div>
              <Separator />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
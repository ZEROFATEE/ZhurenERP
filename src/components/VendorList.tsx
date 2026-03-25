import * as React from "react"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, ChevronLeft } from "lucide-react"

type Vendorlist = {
  id: number
  vendor: string
  account: string
  contact: number
  email: string
  address: string
  name: string
  date: string
  description: string
  quantity: number
  amount: number
  status: "Paid" | "Pending" | "Cancelled"
}

const vendorList: Vendorlist[] = [
  { id: 1, vendor: "name", account: "acc", contact: 123456789, email: "name@email.com", address: "Legazpi",
    name: "name", date: "2/2/2026", description: "desc", quantity: 67, amount: 67, status: "Paid" },
]

const statusColors: Record<Vendorlist["status"], string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
}

const VIEW_A = "40px 1fr 1fr 1fr 1fr 1fr"
const VIEW_B = "40px 1fr 1fr 1fr 1fr 1fr 90px"

export default function Vendorlist() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-md border w-full">

      {/* Header */}
      <div className="flex items-center bg-muted rounded-t-md px-4 py-2">
        <div className="grid gap-2 text-xs font-semibold text-muted-foreground items-center flex-1"
          style={{ gridTemplateColumns: expanded ? VIEW_B : VIEW_A }}>
          {!expanded ? (
            <>
              <span>#</span>
              <span>Vendor</span>
              <span>Account</span>
              <span>Contact</span>
              <span>Email</span>
              <span>Address</span>
              <span />
            </>
          ) : (
            <>
              <span>#</span>
              <span>Name</span>
              <span>Date</span>
              <span>Description</span>
              <span>Quantity</span>
              <span>Amount</span>
              <span>Status</span>
              <span />
            </>
          )}
        </div>

        {/* Toggle button outside the grid */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-3 flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground border rounded-md hover:bg-background transition-colors"
        >
          {expanded ? (
            <><ChevronLeft className="w-3.5 h-3.5" /> Vendor info</>
          ) : (
            <>Orders <ChevronRight className="w-3.5 h-3.5" /></>
          )}
        </button>
      </div>

      <Separator />

      {/* Rows */}
      <ScrollArea className="h-[510px]">
        <div className="p-2">
          {vendorList.map((vendor) => (
            <React.Fragment key={vendor.id}>
              <div className="flex items-center px-2 py-3 text-sm hover:bg-muted/50 rounded-md transition-colors">
                <div className="grid gap-2 items-center flex-1"
                  style={{ gridTemplateColumns: expanded ? VIEW_B : VIEW_A }}>
                  <span className="text-muted-foreground">{vendor.id}</span>
                  {!expanded ? (
                    <>
                      <span>{vendor.vendor}</span>
                      <span>{vendor.account}</span>
                      <span>{vendor.contact}</span>
                      <span className="truncate">{vendor.email}</span>
                      <span>{vendor.address}</span>
                      <span />
                    </>
                  ) : (
                    <>
                      <span>{vendor.name}</span>
                      <span>{vendor.date}</span>
                      <span>{vendor.description}</span>
                      <span>{vendor.quantity}</span>
                      <span>{vendor.amount}</span>
                      <span className={`inline-flex w-fit px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[vendor.status]}`}>
                        {vendor.status}
                      </span>
                      <span />
                    </>
                  )}
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
import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Maximize2 } from "lucide-react"
import type { Vendor } from "@/api/vendor"

const VIEW_COLUMNS = "40px 1.5fr 1fr 1fr 1fr 100px"

interface VendorlistProps {
  data: Vendor[]
  onExpand: (vendor: Vendor) => void
}

export default function Vendorlist({ data, onExpand }: VendorlistProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-md border w-full p-8 text-center text-gray-400 text-sm">
        No vendors found.
      </div>
    )
  }

  return (
    <div className="rounded-md border w-full">
      <div className="flex items-center bg-muted rounded-t-md px-4 py-2">
        <div
          className="grid gap-2 text-xs font-semibold text-muted-foreground items-center flex-1"
          style={{ gridTemplateColumns: VIEW_COLUMNS }}
        >
          <span>#</span>
          <span>Name</span>
          <span>Date Received</span>
          <span>Shipping Date</span>
          <span>Amount</span>
          <span className="text-center">Actions</span>
        </div>
      </div>

      <Separator />

      <ScrollArea className="h-[510px]">
        <div className="p-2">
          {data.map((vendor) => (
            <React.Fragment key={vendor.id}>
              <div className="flex items-center px-2 py-3 text-sm hover:bg-muted/50 rounded-md transition-colors">
                <div
                  className="grid gap-2 items-center flex-1"
                  style={{ gridTemplateColumns: VIEW_COLUMNS }}
                >
                  <span className="text-muted-foreground">{vendor.id}</span>
                  <span className="font-medium text-black">{vendor.name}</span>
                  <span className="text-muted-foreground">
                    {vendor.date_received
                      ? new Date(vendor.date_received).toLocaleDateString()
                      : "—"}
                  </span>
                  <span className="text-muted-foreground">
                    {vendor.shipping_date
                      ? new Date(vendor.shipping_date).toLocaleDateString()
                      : "—"}
                  </span>
                  <span className="font-medium text-black">
                    ₱{Number(vendor.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </span>

                  <div className="flex justify-center">
                    <button
                      onClick={() => onExpand(vendor)}
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
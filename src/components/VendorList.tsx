import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Maximize2 } from "lucide-react"

type VendorlistType = {
  id: number
  name: string
  dateReceived: string
  shippingDate: string
  amount: number
}

// Move data to parent component or import from elsewhere
const vendorList: VendorlistType[] = [
  { id: 1, name: "Porter Robinson", dateReceived: "2/1/2026", shippingDate: "2/5/2026", amount: 1250.00 },
  { id: 2, name: "Hikaru Utada", dateReceived: "2/2/2026", shippingDate: "2/6/2026", amount: 8500.00 },
  { id: 3, name: "Kanye West", dateReceived: "2/3/2026", shippingDate: "2/7/2026", amount: 3200.00 },
]

const VIEW_COLUMNS = "40px 1.5fr 1fr 1fr 1fr 100px"

interface VendorlistProps {
  onExpand: (vendor: VendorlistType) => void
}

export default function Vendorlist({ onExpand }: VendorlistProps) {
  return (
    <div className="rounded-md border w-full">
      {/* Header */}
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

      {/* Rows */}
      <ScrollArea className="h-[510px]">
        <div className="p-2">
          {vendorList.map((vendor) => (
            <React.Fragment key={vendor.id}>
              <div className="flex items-center px-2 py-3 text-sm hover:bg-muted/50 rounded-md transition-colors">
                <div 
                  className="grid gap-2 items-center flex-1"
                  style={{ gridTemplateColumns: VIEW_COLUMNS }}
                >
                  <span className="text-muted-foreground">{vendor.id}</span>
                  <span className="font-medium">{vendor.name}</span>
                  <span className="text-muted-foreground">{vendor.dateReceived}</span>
                  <span className="text-muted-fo$reground">{vendor.shippingDate}</span>
                  <span className="font-medium">Php {vendor.amount.toLocaleString()}</span>
                  
                  {/* Expand button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => onExpand(vendor)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
                      title="View inventory details"
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
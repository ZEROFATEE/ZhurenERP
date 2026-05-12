import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Maximize2 } from "lucide-react"
import type { Vendor } from "@/api/vendor"

interface CustomerListProps {
  data: Vendor[];
  onExpand?: (customer: Vendor) => void;
}

export default function CustomerList({ data, onExpand }: CustomerListProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-md border w-full p-8 text-center text-gray-400 text-sm">
        No customers found.
      </div>
    )
  }

  return (
    <div className="rounded-md border w-full">
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted rounded-t-md items-center">
        <span>#</span>
        <span>Customer</span>
        <span>Contact</span>
        <span>Address</span>
        <span className="text-right">Balance</span>
        <span className="text-center">Actions</span>
      </div>
      <Separator />

      <ScrollArea className="h-[510px]">
        <div className="p-2">
          {data.map((customer) => (
            <React.Fragment key={customer.id}>
              <div className="grid grid-cols-6 gap-4 px-2 py-3 text-sm items-center hover:bg-muted/50 rounded-md transition-colors">
                <span className="text-muted-foreground">{customer.id}</span>
                <span className="font-medium truncate">{customer.name}</span>
                <span className="text-muted-foreground truncate">
                  {customer.contact || "—"}
                </span>
                <span className="truncate">
                  {customer.mailing_address || "—"}
                </span>
                <span className="font-medium text-right">
                  ₱{Number(customer.amount).toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </span>

                {/* Expand Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => onExpand?.(customer)}
                    className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
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

      {/* Footer count */}
      <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400">
        {data.length} customer{data.length !== 1 ? "s" : ""}
      </div>
    </div>
  )
}
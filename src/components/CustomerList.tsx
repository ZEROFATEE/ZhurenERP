import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type Customer = {
  id: number
  customerid: string
  address: string
  balance: number
}
// temporary chuchu
const mockCustomer: Customer[] = [
  { id: 1, customerid: "Markiplier", address: "Legazpi City", balance: 1000},
  { id: 2, customerid: "Jacksepticeye", address: "Albay", balance: 3000 },
  { id: 3, customerid: "Ryan Gosling", address: "Oas", balance: 2000 },
  { id: 4, customerid: "Jack Black", address: "Tabaco", balance: 5000 },
  { id: 5, customerid: "Barrack Obama", address: "Polangui", balance: 4000},
  { id: 6, customerid: "Kanye West", address: "Daraga", balance: 10000},
  { id: 7, customerid: "Kanye East", address: "Cullat", balance: 1000,},
  { id: 8, customerid: "Sabrina Carpenter", address: "Washingston", balance: 6000 },
  { id: 9, customerid: "Porter Robinson", address: "Rawis", balance: 2000 },
  { id: 10, customerid: "Charlie Kirk", address: "Oro Site", balance: 1000 },
]


export default function CustomerList() {
  return (
    <div className="rounded-md border">
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted rounded-t-md">
        <span>#</span>
        <span>Customer</span>
        <span>Address</span>
        <span>Balance</span>
      </div>
      <Separator />

      <ScrollArea className="h-[510px]">
        <div className="p-2">
          {mockCustomer.map((customer) => (
            <React.Fragment key={customer.id}>
              <div className="grid grid-cols-6 gap-4 px-2 py-3 text-sm items-center hover:bg-muted/50 rounded-md transition-colors">
                <span className="text-muted-foreground">{customer.id}</span>
                <span className="font-medium truncate">{customer.customerid}</span>
                <span className="truncate">{customer.address}</span>
                {/* ADD EXPAND BUTTON THAT SHOWS YUNG PREVIOUS TRANSACTION */}
                <span>₱{customer.balance}</span>
              </div>
              <Separator />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
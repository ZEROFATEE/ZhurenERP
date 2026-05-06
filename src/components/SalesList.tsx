import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"

// Match your inventory table structure for received items
type InventoryItem = {
  id: number
  item: string        // item code (e.g., ITEM-001)
  name: string
  description: string | null
  item_class: string | null
  price_level: number
  serial_number: string | null
  last_unit_cost: number
  gl_sales_account: string | null
  inventory_account: string | null
  gl_cost_of_sales_account: string | null
  item_tax_type: string
  shipping_date: string | null
  date_received: string
  amount: number
  status: string    // "Received" | "NotReceived" etc.
  created_at: string
  updated_at: string
}

export default function SalesList() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReceivedItems = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/inventory')
        if (!res.ok) throw new Error('Failed to fetch inventory')
        
        const data = await res.json()
        // Filter only "Received" status items
        const received = data.filter((item: InventoryItem) => item.status === 'Received')
        setItems(received)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReceivedItems()
  }, [])

  if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading inventory...</div>
  if (error) return <div className="p-4 text-sm text-red-500">Error: {error}</div>
  if (items.length === 0) return <div className="p-4 text-sm text-muted-foreground">No received items available for sale.</div>

  return (
    <div className="rounded-md border">
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted rounded-t-md">
        <span>#</span>
        <span>Item Code</span>
        <span>Name</span>
        <span>Unit Price</span>
        <span>Amount</span>
        <span>Date Received</span>
      </div>
      <Separator />

      <ScrollArea className="h-[510px]">
        <div className="p-2">
          {items.map((item) => (
            <React.Fragment key={item.id}>
              <div className="grid grid-cols-6 gap-4 px-2 py-3 text-sm items-center hover:bg-muted/50 rounded-md transition-colors">
                <span className="text-muted-foreground">{item.id}</span>
                <span className="font-medium truncate">{item.item}</span>
                <span className="truncate">{item.name}</span>
                <span>₱{item.price_level.toLocaleString()}</span>
                <span>₱{item.amount.toLocaleString()}</span>
                <span>{item.date_received}</span>
              </div>
              <Separator />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
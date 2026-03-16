import { Button } from "@/components/ui/button"
import { clsx, type ClassValue } from "clsx"
import { Badge } from "lucide-react"
import { Avatar } from "radix-ui"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

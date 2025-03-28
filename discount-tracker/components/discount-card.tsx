"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Clock, ExternalLink, MoreVertical, Eye, EyeOff, Edit, Trash, Share } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Discount } from "@/lib/types"
import Link from "next/link"

interface DiscountCardProps {
  discount: Discount
  onDelete?: (id: string) => void
}

export default function DiscountCard({ discount, onDelete }: DiscountCardProps) {
  const [copied, setCopied] = useState(false)
  const [copiedCount, setCopiedCount] = useState(discount.copiedCount || 0)
  const [lastCopied, setLastCopied] = useState<string | undefined>(discount.lastCopied)

  const copyToClipboard = () => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard
          .writeText(discount.code)
          .then(() => {
            setCopied(true)
            const newCount = copiedCount + 1
            setCopiedCount(newCount)
            const now = new Date().toISOString()
            setLastCopied(now)
            setTimeout(() => setCopied(false), 2000)
          })
          .catch((err) => {
            console.error("Failed to copy: ", err)
          })
      } else {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement("textarea")
        textArea.value = discount.code
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand("copy")
          setCopied(true)
          const newCount = copiedCount + 1
          setCopiedCount(newCount)
          const now = new Date().toISOString()
          setLastCopied(now)
          setTimeout(() => setCopied(false), 2000)
        } catch (err) {
          console.error("Fallback: Could not copy text: ", err)
        }
        document.body.removeChild(textArea)
      }
    } catch (error) {
      console.error("Error in copyToClipboard:", error)
    }
  }

  const isExpiringSoon = () => {
    try {
      const expiryDate = new Date(discount.expiryDate)
      const now = new Date()
      const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 7
    } catch (error) {
      console.error("Error in isExpiringSoon:", error)
      return false
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    } catch (error) {
      console.error("Error in formatDate:", error)
      return "Invalid date"
    }
  }

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Never"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error in formatDateTime:", error)
      return "Invalid date"
    }
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "Coupon":
        return "default"
      case "Cashback":
        return "secondary"
      case "Referral":
        return "outline"
      case "Deal":
        return "destructive"
      default:
        return "default"
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      try {
        if (window.confirm(`Are you sure you want to delete the ${discount.brand} discount?`)) {
          onDelete(discount.id)
        }
      } catch (error) {
        console.error("Error in handleDelete:", error)
      }
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Mobile-optimized layout */}
        <div className="flex flex-col sm:flex-row sm:items-start p-4">
          <div className="flex items-start w-full">
            <div className="flex-shrink-0 mr-4">
              <img
                src={discount.logo || "/placeholder.svg?height=64&width=64"}
                alt={discount.brand}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-md object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 mr-2">
                  <h3 className="font-bold text-lg truncate">{discount.brand}</h3>
                  {discount.isPublic ? (
                    <Eye className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Badge variant={getBadgeVariant(discount.type)} className="text-xs">
                    {discount.type}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/edit/${discount.id}`}>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {discount.category && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {discount.category}
                </Badge>
              )}

              {discount.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{discount.description}</p>
              )}

              <div className="flex flex-col mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className={isExpiringSoon() ? "text-destructive font-medium" : ""}>
                    Expires: {formatDate(discount.expiryDate)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center mt-1 text-xs">
                  <span>Copied: {copiedCount} times</span>
                  <span className="mx-1">•</span>
                  <span className="truncate">Last: {formatDateTime(lastCopied)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/50 border-t">
          <div className="flex items-center overflow-hidden">
            <code className="bg-background px-2 py-1 rounded text-sm font-mono truncate max-w-[120px] sm:max-w-none">
              {discount.code}
            </code>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {discount.url && (
              <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                <a href={discount.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


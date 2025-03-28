"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { discounts, categories } from "@/lib/data"
import type { Discount } from "@/lib/types"
import { ErrorBoundary } from "@/components/error-boundary"

export default function EditOffer() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [discount, setDiscount] = useState<Discount | null>(null)
  const [date, setDate] = useState<Date>(new Date())
  const [isPublic, setIsPublic] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Find the discount with the matching ID
      const foundDiscount = discounts.find((d) => d.id === id)
      if (foundDiscount) {
        setDiscount(foundDiscount)
        setDate(new Date(foundDiscount.expiryDate))
        setIsPublic(foundDiscount.isPublic || false)
      } else {
        // Set error if discount not found
        setError("Discount not found")
      }
    } catch (err) {
      console.error("Error loading discount:", err)
      setError("Failed to load discount details")
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // In a real app, this would update the discount in the database
      alert("Discount updated successfully!")
      router.push("/dashboard")
    } catch (err) {
      console.error("Error updating discount:", err)
      setError("Failed to update discount")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading discount details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl p-4 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!discount) {
    return (
      <div className="container mx-auto max-w-7xl p-4 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-bold mb-2">Discount Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The discount you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="container mx-auto max-w-7xl flex items-center h-16 px-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold ml-2">Edit Offer</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto max-w-7xl px-4 py-6">
          <div className="max-w-md mx-auto">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" defaultValue={discount.brand} placeholder="e.g. Nike, Amazon" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Discount Code</Label>
                <Input id="code" defaultValue={discount.code} placeholder="e.g. SUMMER25" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Offer Type</Label>
                <Select defaultValue={discount.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select offer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coupon">Coupon</SelectItem>
                    <SelectItem value="Cashback">Cashback</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Deal">Deal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue={discount.category || "Other"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  defaultValue={discount.description || ""}
                  placeholder="e.g. 25% off summer collection"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL (Optional)</Label>
                <Input
                  id="url"
                  type="url"
                  defaultValue={discount.url || ""}
                  placeholder="e.g. https://nike.com/summer-sale"
                />
              </div>

              <div className="flex items-center justify-between space-y-0 pt-2">
                <Label htmlFor="public-toggle">Make this offer public</Label>
                <Switch id="public-toggle" checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Usage Statistics</Label>
                <div className="bg-muted p-3 rounded-md text-sm">
                  <div className="flex justify-between">
                    <span>Copied Count:</span>
                    <span className="font-medium">{discount.copiedCount || 0}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Last Copied:</span>
                    <span className="font-medium">
                      {discount.lastCopied
                        ? new Date(discount.lastCopied).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Never"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="submit" className="flex-1">
                  Update Discount
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}


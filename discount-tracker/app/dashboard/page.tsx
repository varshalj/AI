"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Globe, Filter } from "lucide-react"
import DiscountCard from "@/components/discount-card"
import { discounts as initialDiscounts } from "@/lib/data"
import type { Discount } from "@/lib/types"
import { categories } from "@/lib/data"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ErrorBoundary } from "@/components/error-boundary"

export default function Dashboard() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<{
    categories: string[]
    types: string[]
    expiringSoon: boolean
  }>({
    categories: [],
    types: [],
    expiringSoon: false,
  })

  // Safely initialize data
  useEffect(() => {
    setDiscounts(initialDiscounts)
  }, [])

  const handleDelete = (id: string) => {
    setDiscounts(discounts.filter((discount) => discount.id !== id))
  }

  const applyFilters = (discount: Discount) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        discount.brand.toLowerCase().includes(query) ||
        discount.code.toLowerCase().includes(query) ||
        discount.type.toLowerCase().includes(query) ||
        (discount.description && discount.description.toLowerCase().includes(query)) ||
        (discount.category && discount.category.toLowerCase().includes(query))

      if (!matchesSearch) return false
    }

    // Category filter
    if (activeFilters.categories.length > 0 && discount.category) {
      if (!activeFilters.categories.includes(discount.category)) {
        return false
      }
    }

    // Type filter
    if (activeFilters.types.length > 0) {
      if (!activeFilters.types.includes(discount.type)) {
        return false
      }
    }

    // Expiring soon filter
    if (activeFilters.expiringSoon) {
      const expiryDate = new Date(discount.expiryDate)
      const now = new Date()
      const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays > 7) {
        return false
      }
    }

    return true
  }

  const filteredDiscounts = discounts.filter(applyFilters)

  const activeFilterCount =
    activeFilters.categories.length + activeFilters.types.length + (activeFilters.expiringSoon ? 1 : 0)

  const toggleCategoryFilter = (category: string) => {
    setActiveFilters((prev) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]

      return {
        ...prev,
        categories: newCategories,
      }
    })
  }

  const toggleTypeFilter = (type: string) => {
    setActiveFilters((prev) => {
      const newTypes = prev.types.includes(type) ? prev.types.filter((t) => t !== type) : [...prev.types, type]

      return {
        ...prev,
        types: newTypes,
      }
    })
  }

  const toggleExpiringSoonFilter = () => {
    setActiveFilters((prev) => ({
      ...prev,
      expiringSoon: !prev.expiringSoon,
    }))
  }

  const clearAllFilters = () => {
    setActiveFilters({
      categories: [],
      types: [],
      expiringSoon: false,
    })
    setSearchQuery("")
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="container mx-auto max-w-7xl flex items-center justify-between h-16 px-4">
            <h1 className="text-xl font-bold">DiscountTracker</h1>
            <div className="flex items-center gap-2">
              <Link href="/public-offers">
                <Button variant="outline" size="sm" className="gap-1">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Public Offers</span>
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <img src="/placeholder.svg?height=32&width=32" alt="Profile" className="w-8 h-8 rounded-full" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Search and Filter */}
        <div className="sticky top-16 z-10 bg-white border-b">
          <div className="container mx-auto max-w-7xl px-4 py-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search discounts..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Filter className="h-4 w-4" />
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Filter Discounts</SheetTitle>
                    <SheetDescription>Apply filters to find specific discounts</SheetDescription>
                  </SheetHeader>

                  <div className="py-4 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Categories</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={activeFilters.categories.includes(category)}
                              onCheckedChange={() => toggleCategoryFilter(category)}
                            />
                            <Label htmlFor={`category-${category}`}>{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Offer Types</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {["Coupon", "Cashback", "Referral", "Deal"].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`type-${type}`}
                              checked={activeFilters.types.includes(type)}
                              onCheckedChange={() => toggleTypeFilter(type)}
                            />
                            <Label htmlFor={`type-${type}`}>{type}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Other Filters</h3>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="expiring-soon"
                          checked={activeFilters.expiringSoon}
                          onCheckedChange={toggleExpiringSoonFilter}
                        />
                        <Label htmlFor="expiring-soon">Expiring within 7 days</Label>
                      </div>
                    </div>
                  </div>

                  <SheetFooter className="flex-row justify-between sm:justify-between gap-2 mt-2">
                    <Button variant="outline" onClick={clearAllFilters}>
                      Clear All
                    </Button>
                    <SheetClose asChild>
                      <Button>Apply Filters</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active filters display */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {activeFilters.categories.map((category) => (
                  <Badge
                    key={`cat-${category}`}
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => toggleCategoryFilter(category)}
                  >
                    {category} ×
                  </Badge>
                ))}

                {activeFilters.types.map((type) => (
                  <Badge
                    key={`type-${type}`}
                    variant="secondary"
                    className="flex items-center gap-1"
                    onClick={() => toggleTypeFilter(type)}
                  >
                    {type} ×
                  </Badge>
                ))}

                {activeFilters.expiringSoon && (
                  <Badge variant="destructive" className="flex items-center gap-1" onClick={toggleExpiringSoonFilter}>
                    Expiring Soon ×
                  </Badge>
                )}

                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearAllFilters}>
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 container mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-4">
            {filteredDiscounts.length > 0 ? (
              filteredDiscounts.map((discount) => (
                <DiscountCard key={discount.id} discount={discount} onDelete={handleDelete} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No discounts found</p>
                {(searchQuery || activeFilterCount > 0) && (
                  <Button variant="link" onClick={clearAllFilters} className="mt-2">
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Add Button */}
        <div className="fixed bottom-6 right-6">
          <Link href="/add">
            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </ErrorBoundary>
  )
}


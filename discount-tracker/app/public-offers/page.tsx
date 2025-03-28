import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft, Clock, Lock } from "lucide-react"
import { discounts } from "@/lib/data"

export default function PublicOffers() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto max-w-7xl flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold ml-2">Public Offers</h1>
          </div>
          <Link href="/login">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Search */}
      <div className="sticky top-16 z-10 bg-white border-b">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search public offers..." className="pl-9" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {discounts.map((discount) => (
            <Card key={discount.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <img
                      src={discount.logo || "/placeholder.svg?height=40&width=40"}
                      alt={discount.brand}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <Badge variant="outline">{discount.type}</Badge>
                  </div>
                  <h3 className="font-bold">{discount.brand}</h3>
                  {discount.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{discount.description}</p>
                  )}
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      Expires:{" "}
                      {new Date(discount.expiryDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-muted/50 border-t flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-background px-2 py-1 rounded text-sm font-mono blur-sm select-none">
                      {discount.code}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="max-w-md mx-auto p-6 bg-muted rounded-lg">
            <Lock className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <h2 className="text-lg font-bold mb-2">Sign in to see more</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Create an account to view full discount codes and add your own offers.
            </p>
            <Link href="/login">
              <Button>Sign In or Register</Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t">
        <div className="container mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 DiscountTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}


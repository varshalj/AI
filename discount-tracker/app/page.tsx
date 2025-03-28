import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Camera, Search, Tag, Clock, Gift, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { discounts } from "@/lib/data"

export default function Home() {
  // Get only public offers for the showcase
  const publicOffers = discounts.filter((d) => d.isPublic).slice(0, 4)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto max-w-7xl flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold">DiscountTracker</h1>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto max-w-7xl px-4 py-12 md:py-24">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Never Miss a Discount Again</h2>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Capture, organize, and use your discount codes with our AI-powered app.
          </p>
          <div className="flex flex-wrap gap-3 mt-8 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Start Tracking <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/public-offers">
              <Button size="lg" variant="outline" className="gap-2">
                <Globe size={16} />
                Browse Public Offers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Public Offers Section */}
      <section className="container mx-auto max-w-7xl px-4 py-12 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Popular Public Offers</h2>
          <Link href="/public-offers">
            <Button variant="link" className="gap-1">
              View All <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {publicOffers.map((discount) => (
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
                    <div className="bg-background px-2 py-1 rounded text-sm font-mono blur-sm hover:blur-none transition-all select-none">
                      {discount.code}
                    </div>
                  </div>
                  <Link href="/login">
                    <Button size="sm" variant="outline">
                      Sign in to use
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-2xl font-bold text-center">Key Features</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
              <Camera className="text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">AI Extraction</h3>
            <p className="text-muted-foreground">
              Simply snap a photo of your discount code or offer, and our AI will automatically extract all the details.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
              <Search className="text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Smart Search</h3>
            <p className="text-muted-foreground">
              Quickly find the discount you need with powerful search and filtering options.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
              <Clock className="text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Expiry Alerts</h3>
            <p className="text-muted-foreground">
              Get notified before your discounts expire so you never miss out on savings.
            </p>
          </div>
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="flex-1">
            <h2 className="mb-4 text-2xl font-bold">AI-Powered Discount Extraction</h2>
            <p className="mb-4 text-muted-foreground">
              Our advanced AI technology automatically extracts all the important details from your discount codes:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Tag size={16} className="text-primary" />
                <span>Brand name and logo identification</span>
              </li>
              <li className="flex items-center gap-2">
                <Gift size={16} className="text-primary" />
                <span>Offer type detection (coupon, cashback, etc.)</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <span>Expiry date recognition</span>
              </li>
            </ul>
            <Link href="/dashboard" className="mt-6 inline-block">
              <Button>Try It Now</Button>
            </Link>
          </div>
          <div className="flex-1">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <img src="/placeholder.svg?height=400&width=400" alt="AI extraction demo" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 mt-auto border-t">
        <div className="container mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 DiscountTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}


"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Camera, ArrowLeft, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { categories } from "@/lib/data"
import { ErrorBoundary } from "@/components/error-boundary"

export default function AddOffer() {
  const [date, setDate] = useState<Date>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
  )
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [extractedData, setExtractedData] = useState<{
    brand: string
    code: string
    type: string
    description: string
  } | null>(null)

  // Use a ref to store the abort controller
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        setIsUploading(true)

        // Clean up previous controller if it exists
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        // Create a new controller
        abortControllerRef.current = new AbortController()

        // Simulate file upload
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target) {
            setUploadedImage(event.target.result as string)
            setIsUploading(false)
            simulateAIProcessing()
          }
        }
        reader.onerror = () => {
          setIsUploading(false)
          console.error("Error reading file")
        }
        reader.readAsDataURL(e.target.files[0])
      }
    } catch (error) {
      setIsUploading(false)
      console.error("Error in handleImageUpload:", error)
    }
  }

  const simulateAIProcessing = () => {
    try {
      setIsProcessing(true)

      // Create a new controller for this operation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      // Simulate AI processing delay
      const timeoutId = setTimeout(() => {
        setExtractedData({
          brand: "Nike",
          code: "SUMMER25",
          type: "Coupon",
          description: "25% off summer collection",
        })
        setIsProcessing(false)
      }, 2000)

      // Clean up on unmount
      return () => {
        clearTimeout(timeoutId)
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
      }
    } catch (error) {
      setIsProcessing(false)
      console.error("Error in simulateAIProcessing:", error)
    }
  }

  const renderForm = () => {
    return (
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" defaultValue={extractedData?.brand || ""} placeholder="e.g. Nike, Amazon" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Discount Code</Label>
          <Input id="code" defaultValue={extractedData?.code || ""} placeholder="e.g. SUMMER25" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Offer Type</Label>
          <Select defaultValue={extractedData?.type || "Coupon"}>
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
          <Select defaultValue="Other">
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
            defaultValue={extractedData?.description || ""}
            placeholder="e.g. 25% off summer collection"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">URL (Optional)</Label>
          <Input id="url" type="url" placeholder="e.g. https://nike.com/summer-sale" />
        </div>

        <div className="flex items-center justify-between space-y-0 pt-2">
          <Label htmlFor="public-toggle">Make this offer public</Label>
          <Switch id="public-toggle" checked={isPublic} onCheckedChange={setIsPublic} />
        </div>

        <div className="pt-4">
          <Button className="w-full">Save Discount</Button>
        </div>
      </form>
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
            <h1 className="text-xl font-bold ml-2">Add New Offer</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto max-w-7xl px-4 py-6">
          <Tabs defaultValue="manual" className="max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="image">Image Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <div className="max-w-md mx-auto">{renderForm()}</div>
            </TabsContent>

            <TabsContent value="image">
              {!uploadedImage ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">Upload an Offer</h2>
                    <p className="text-muted-foreground">Take a photo or upload an image of your discount code</p>
                  </div>

                  <div className="w-full max-w-md">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                      <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <div className="mt-4">
                        <Label htmlFor="image-upload" className="cursor-pointer">
                          <span className="font-medium text-primary">Click to upload</span>
                          <span className="text-muted-foreground"> or drag and drop</span>
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">PNG, JPG or HEIC up to 10MB</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  {isProcessing ? (
                    <Card className="mb-6">
                      <CardContent className="flex flex-col items-center justify-center py-6">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <h3 className="font-medium text-lg">Processing Image</h3>
                        <p className="text-sm text-muted-foreground text-center mt-2">
                          Our AI is extracting discount details from your image...
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <div className="mb-6">
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Uploaded offer"
                          className="w-full h-auto rounded-lg border"
                        />
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                          AI has extracted the following details. Please verify or edit.
                        </p>
                      </div>

                      {renderForm()}
                    </>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ErrorBoundary>
  )
}


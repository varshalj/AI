"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Bell, Lock, LogOut } from "lucide-react"

export default function Profile() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto max-w-7xl flex items-center h-16 px-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold ml-2">Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Profile Info */}
          <div className="flex items-center mb-6">
            <img src="/placeholder.svg?height=80&width=80" alt="Profile" className="w-20 h-20 rounded-full mr-4" />
            <div>
              <h2 className="text-xl font-bold">Jane Smith</h2>
              <p className="text-muted-foreground">jane.smith@example.com</p>
              <Button variant="outline" size="sm" className="mt-2">
                Edit Profile
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Privacy Settings */}
            <div>
              <h3 className="text-lg font-medium flex items-center mb-4">
                <Lock className="h-5 w-5 mr-2" />
                Privacy Settings
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-profile">Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Allow others to see your shared discounts</p>
                  </div>
                  <Switch id="public-profile" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-activity">Share Activity</Label>
                    <p className="text-sm text-muted-foreground">Share when you add new discounts</p>
                  </div>
                  <Switch id="share-activity" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Notification Settings */}
            <div>
              <h3 className="text-lg font-medium flex items-center mb-4">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="expiry-notifications">Expiry Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified when discounts are about to expire</p>
                  </div>
                  <Switch id="expiry-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Actions */}
            <div className="pt-2">
              <Button variant="outline" className="w-full justify-start text-destructive" size="lg">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


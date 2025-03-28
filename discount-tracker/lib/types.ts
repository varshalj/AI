export interface Discount {
  id: string
  brand: string
  type: "Coupon" | "Cashback" | "Referral" | "Deal"
  code: string
  expiryDate: string
  description?: string
  url?: string
  logo?: string
  category?: string
  isPublic?: boolean
  copiedCount?: number
  lastCopied?: string
}

export type DiscountCategory =
  | "Food & Dining"
  | "Shopping"
  | "Travel"
  | "Entertainment"
  | "Electronics"
  | "Fashion"
  | "Health & Beauty"
  | "Home & Garden"
  | "Other"


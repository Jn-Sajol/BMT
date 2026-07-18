export interface LandingPageSection {
  title: string
  content: string
}

export interface LandingPage {
  id: string
  name: string
  category: string
  sections: LandingPageSection[]
  adSlots: string[] // Custom HTML block templates or scripts to render advertisements
  status: "DRAFT" | "PUBLISHED"
  createdAt: Date
  publishedAt?: Date
}

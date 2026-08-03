import { z } from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:4000/api/v1"),
  NEXT_PUBLIC_FB_APP_ID: z.string().optional().default(""),
  NEXT_PUBLIC_FB_APP_SECRET: z.string().optional().default(""),
  NEXT_PUBLIC_FB_PAGE_ID_CARE_HUB_BD: z.string().optional().default(""),
  NEXT_PUBLIC_FB_PAGE_TOKEN_CARE_HUB_BD: z.string().optional().default(""),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_FB_APP_ID: process.env.NEXT_PUBLIC_FB_APP_ID,
  NEXT_PUBLIC_FB_APP_SECRET: process.env.NEXT_PUBLIC_FB_APP_SECRET,
  NEXT_PUBLIC_FB_PAGE_ID_CARE_HUB_BD: process.env.NEXT_PUBLIC_FB_PAGE_ID_CARE_HUB_BD,
  NEXT_PUBLIC_FB_PAGE_TOKEN_CARE_HUB_BD: process.env.NEXT_PUBLIC_FB_PAGE_TOKEN_CARE_HUB_BD,
})

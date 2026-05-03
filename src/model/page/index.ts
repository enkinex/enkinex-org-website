import { z } from "zod"
import type { Navbar } from "@/model/navbar"

export interface PageMetadata {
  language: string
  title: string
}

export interface Page {
  route: string
  metadata: PageMetadata
  navbar: Navbar
}

export const PageRequest = z.object({
  page: z.string(),
  language: z.string(),
})

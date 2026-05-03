import { createServerFn } from "@tanstack/react-start"
import { env } from "cloudflare:workers"

import type { Page } from "@/model/page"
import { DatabaseConfig } from "@/database/config.ts"
import { PageRequest } from "@/model/page"

const DATABASE_CONFIG = new DatabaseConfig(env)

export const getPage = createServerFn({ method: "GET" })
  .inputValidator(PageRequest)
  .handler(async ({ data, context }): Promise<Page> => {
    const language = data.language || "en-US"

    console.log("context", context)

    const response = await fetch(
      `${DATABASE_CONFIG.apiPath()}/page/${data.page}/${language}`,
      {
        method: "GET",
        headers: DATABASE_CONFIG.apiHeaders(),
      },
    )

    if (!response.ok) {
      const log_details = { route: "home", language: language }
      throw new Error(`Failed to fetch page data: ${log_details}`)
    }

    return response.json()
  })

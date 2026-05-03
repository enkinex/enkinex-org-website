import { createFileRoute } from "@tanstack/react-router"

import type { Page } from "@/model/page"
import { getPage } from "@/api/page"
import { LandingNavbar } from "@/components/navbar/Landing"
import { getMeta } from "@/model/page/meta"

export const Route = createFileRoute("/{-$language}/components")({
  component: ServicesPage,
  loader: async ({ params }): Promise<Page> =>
    getPage({
      data: { page: "components", language: params.language || "en-US" },
    }),
  preloadStaleTime: 3_000,
  head: ({ loaderData }) => ({
    meta: getMeta(loaderData),
  }),
})

function ServicesPage() {
  const page: Page = Route.useLoaderData()

  return (
    <>
      <LandingNavbar navbar={page.navbar} />
    </>
  )
}

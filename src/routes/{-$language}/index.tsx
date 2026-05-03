import { createFileRoute } from "@tanstack/react-router"
import { Container } from "@mantine/core"

import type { Page } from "@/model/page"
import { getPage } from "@/api/page"
import { LandingNavbar } from "@/components/navbar/Landing"
import { SDMeshDiagram } from "@/components/diagram/SDMeshDiagram"
import { getMeta } from "@/model/page/meta"

export const Route = createFileRoute("/{-$language}/")({
  component: HomePage,
  loader: async ({ params }): Promise<Page> =>
    getPage({ data: { page: "home", language: params.language || "en-US" } }),
  preloadStaleTime: 3_000,
  head: ({ loaderData }) => ({
    meta: getMeta(loaderData),
  }),
})

function HomePage() {
  const page: Page = Route.useLoaderData()

  return (
    <>
      <LandingNavbar navbar={page.navbar} />

      {/* Hero Section */}
      <Container size="xl">
        <div>Enkinex Data & AI Framework</div>
        <SDMeshDiagram />
        <h2>
          Three foundational pillars that converge at the SDMesh API to
          establish a semantic driven software development ecosystem.
        </h2>
      </Container>

      {/* Features Section */}
      <Container size="xl">
        <div>Discovery</div>
        <h1>Enkinex Framework Features</h1>

        {/* SDD Features */}
        <Container size="xl">
          <h2>Semantic Driven Design</h2>
          <p>
            Zero-cost abstractions to define domain-specific knowledge bases.
          </p>
          <ul>
            <li>Functional DSL</li>
            <li>Agentic Automation</li>
            <li>API Affinity</li>
            <li>Multilingual SDKs</li>
          </ul>
        </Container>

        {/* CDL Features */}
        <Container size="xl">
          <h2>Contract Driven Lifecycle</h2>
          <p>
            Software development methodology for contract driven automation.
          </p>
          <ul>
            <li>Semantic Versioning</li>
            <li>Project Lifecycle</li>
            <li>Dependency Management</li>
            <li>Desired State Monitoring</li>
          </ul>
        </Container>

        {/* CMA Features */}
        <Container size="xl">
          <h2>Composable Mesh Architecture</h2>
          <p>Composable multicloud architecture for data & AI applications.</p>
          <ul>
            <li>Governance Graph</li>
            <li>Control Plane</li>
            <li>Cloud Providers</li>
            <li>Data & AI Products</li>
          </ul>
        </Container>
      </Container>
    </>
  )
}

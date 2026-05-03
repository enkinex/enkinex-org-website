import * as React from "react"
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core"

import appCss from "@mantine/core/styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Enkinex",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

const theme = createTheme({
  colors: {
    "en-primary": [
      "#ebf5ff",
      "#d4e7fa",
      "#a4cdf7",
      "#72b2f6",
      "#4d9bf5",
      "#3a8cf5",
      "#3185f6",
      "#2672dc",
      "#1b66c5",
      "#003d79",
    ],
    "en-secondary": [
      "#eef3ff",
      "#dfe4f1",
      "#b9c2da",
      "#9ba7c8",
      "#7d8cb7",
      "#697bad",
      "#5f73a9",
      "#4e6294",
      "#445786",
      "#374a78",
    ],
    "en-accent": [
      "#e4fdff",
      "#d0f7ff",
      "#a0edfd",
      "#6fe3fc",
      "#4edbfb",
      "#3dd6fb",
      "#31d4fc",
      "#21bbe1",
      "#00a8cb",
      "#0090b1",
    ],
  },
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <HeadContent />
      </head>
      <body>
        <MantineProvider
          theme={theme}
          defaultColorScheme="dark"
          withGlobalClasses={true}
        >
          {children}
        </MantineProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

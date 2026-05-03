import type { Page } from "@/model/page"
import type * as React from "react"

export function getMeta(
  page?: Page,
): Array<
  | React.DetailedHTMLProps<
      React.MetaHTMLAttributes<HTMLMetaElement>,
      HTMLMetaElement
    >
  | undefined
> {
  return [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      httpEquiv: "Content-Language",
      content: page ? page.metadata.language : "en-US",
    },
    {
      title: page ? page.metadata.title : "Untitled",
    },
  ]
}

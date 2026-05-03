export interface MenuItem {
  label: string
  order: number
  route: string
}

export type Menu = Array<MenuItem>

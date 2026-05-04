import {
  Box,
  Burger,
  Button,
  Container,
  Divider,
  Drawer,
  Group,
  ScrollArea,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import classes from "./Landing.module.css"

import type { Navbar } from "@/model/navbar"
import { Logo } from "@/components/brand/Logo"

interface NavbarProps {
  navbar: Navbar
}

export function LandingNavbar({ navbar }: NavbarProps) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false)

  const menuItems = navbar.menu.sort((a, b) => a.order - b.order)
  const items = menuItems.map((item) => (
    <a
      key={item.route.replace("/", "_")}
      className={classes.link}
      href={`/${navbar.language}${item.route}`}
    >
      {item.label}
    </a>
  ))

  return (
    <Box pb={60}>
      <header className={classes.header}>
        <Container size="xl" py={16}>
          <Group justify="space-between" h="100%">
            <Logo iconSize={36} showTagline={false} mark="wedge" />

            <Group h="100%" gap={0} visibleFrom="sm">
              {items}
            </Group>

            <Group visibleFrom="sm">
              <Button color="db-primary.9">GitHub</Button>
            </Group>

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="sm"
              aria-label="Toggle navigation"
            />
          </Group>
        </Container>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px" mx="-md">
          <Divider my="sm" />
          {items}
          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button color="db-primary.9">GitHub</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  )
}

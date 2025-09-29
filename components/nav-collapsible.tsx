"use client"

import { IconChevronRight, type Icon } from "@tabler/icons-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavCollapsible({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    items?: {
      title: string
      url: string
      icon?: Icon
    }[]
  }[]
}) {
  const pathname = usePathname()
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url
            const hasSubItems = item.items && item.items.length > 0
            const isOpen = openItems.includes(item.title)

            if (hasSubItems) {
              return (
                <Collapsible
                  key={item.title}
                  open={isOpen}
                  onOpenChange={() => toggleItem(item.title)}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="w-full justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </div>
                        <IconChevronRight
                          className={`transition-transform duration-200 ${
                            isOpen ? "rotate-90" : ""
                          }`}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenu className="ml-4 mt-1">
                        {item.items?.map((subItem) => {
                          const isSubActive = pathname === subItem.url
                          return (
                            <SidebarMenuItem key={subItem.title}>
                              <SidebarMenuButton
                                asChild
                                tooltip={subItem.title}
                                isActive={isSubActive}
                                className={`${
                                  isSubActive
                                    ? "bg-sidebar-accent/80 text-sidebar-accent-foreground font-medium"
                                    : ""
                                }`}
                              >
                                <a href={subItem.url}>
                                  {subItem.icon && <subItem.icon />}
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          )
                        })}
                      </SidebarMenu>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className={
                    isActive
                      ? "bg-sidebar-accent/80 text-sidebar-accent-foreground font-medium"
                      : ""
                  }
                >
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

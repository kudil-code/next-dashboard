"use client"

import { IconCirclePlusFilled, IconMail, IconChevronDown, IconChevronRight, type Icon } from "@tabler/icons-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
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
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (title: string) => {
    setOpenItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  // Check if any sub-item is active to keep parent menu open
  const isSubItemActive = (item: any) => {
    return item.items && item.items.some((subItem: any) => pathname === subItem.url)
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url || (item.items && item.items.some(subItem => pathname === subItem.url))
            const hasSubItems = item.items && item.items.length > 0
            const isOpen = openItems[item.title] || isSubItemActive(item)

            return (
              <div key={item.title}>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild={!hasSubItems}
                    tooltip={item.title}
                    isActive={isActive}
                    className={isActive ? "bg-sidebar-accent/80 text-sidebar-accent-foreground font-medium" : ""}
                    onClick={hasSubItems ? () => toggleItem(item.title) : undefined}
                  >
                      {hasSubItems ? (
                        <div className="flex items-center w-full">
                          {item.icon && <item.icon className={isActive ? "scale-125 transition-transform duration-200" : "transition-transform duration-200"} />}
                          <span>{item.title}</span>
                          <div className="ml-auto">
                            {isOpen ? <IconChevronDown className="size-4" /> : <IconChevronRight className="size-4" />}
                          </div>
                        </div>
                      ) : (
                        <a href={item.url}>
                          {item.icon && <item.icon className={isActive ? "scale-125 transition-transform duration-200" : "transition-transform duration-200"} />}
                          <span>{item.title}</span>
                        </a>
                      )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                {/* Submenu items */}
                {hasSubItems && isOpen && (
                  <div className="ml-4 space-y-1">
                    {item.items!.map((subItem) => {
                      const isSubActive = pathname === subItem.url
                      return (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton 
                            asChild 
                            tooltip={subItem.title}
                            isActive={isSubActive}
                            className={`text-sm ${isSubActive ? "bg-sidebar-accent/80 text-sidebar-accent-foreground font-medium" : ""}`}
                          >
                            <a href={subItem.url}>
                              {subItem.icon && <subItem.icon className={isSubActive ? "scale-125 transition-transform duration-200" : "transition-transform duration-200"} />}
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

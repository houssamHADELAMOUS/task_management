"use client"

import * as React from "react"
import {
  ListTodo,
  LayoutDashboard,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavEmployees } from "@/components/nav-employees"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { type User } from "@/services/api"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User | null
  employees: User[]
}

export function AppSidebar({ user, employees, ...props }: AppSidebarProps) {
  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: ListTodo,
      items: [],
    },
    {
      title: "Team",
      url: "/team",
      icon: Users,
      items: [],
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ListTodo className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Task Manager</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavEmployees employees={employees} />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: `https://avatar.vercel.sh/${user.email}`,
            }}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

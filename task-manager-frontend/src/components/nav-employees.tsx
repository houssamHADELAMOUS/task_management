"use client"

import { Users } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface Employee {
  id: number
  name: string
  email: string
}

export function NavEmployees({
  employees,
}: {
  employees: Employee[]
}) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <Users className="mr-2 h-4 w-4" />
        Employees
      </SidebarGroupLabel>
      <SidebarMenu>
        {employees.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <span className="text-muted-foreground">No employees found</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          employees.map((employee) => (
            <SidebarMenuItem key={employee.id}>
              <SidebarMenuButton asChild>
                <div className="flex items-center gap-2 w-full cursor-pointer">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`https://avatar.vercel.sh/${employee.email}`} alt={employee.name} />
                    <AvatarFallback className="text-xs">
                      {getInitials(employee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium">{employee.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{employee.email}</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}

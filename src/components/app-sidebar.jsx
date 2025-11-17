"use client"

import * as React from "react"
import { useUser } from "@/hooks/useUser"
import {
  Bot,
  ChevronsUpDown,
  DoorClosedIcon,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Logo } from "./logo"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Portfolio",
      url: "#",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "Profile",
          url: "/freelancer-dashboard/portfolio/profile",
        },
        {
          title: "Projects",
          url: "/freelancer-dashboard/portfolio/projects",
        },
      ],
    },
    {
      title: "Jobs",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Apply Jobs",
          url: "/freelancer-dashboard/jobs/apply-jobs",
        },
        {
          title: "Current Jobs",
          url: "/freelancer-dashboard/jobs/current-jobs",
        },
        {
          title: "Finished Jobs",
          url: "/freelancer-dashboard/jobs/finished-jobs",
        },
      ],
    },
  ],
}



export function AppSidebar({
  ...props
}) {
  const { user, loading } = useUser();
  
  

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div
            className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              {/* logo here */}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            {loading ? (
              <>
                <span className="truncate font-medium">Loading...</span>
                <span className="truncate text-xs"></span>
              </>
            ) : (
              <>
                <span className="truncate font-medium">{user?.full_name}</span>
                <span className="truncate text-xs">{user?.category}</span>
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

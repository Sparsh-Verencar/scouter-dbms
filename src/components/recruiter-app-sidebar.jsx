"use client"
import Link from "next/link";
import * as React from "react"
import { Button } from "./ui/button"
import {
  Bot,
  ChevronsUpDown,
  DoorClosedIcon,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useRecruiter } from "@/hooks/useRecruiter";
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Portfolio",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Profile",
          url: "/recruiter-dashboard/profile",
        },
      ],
    },  
    {
      title: "Jobs",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Jobs",
          url: "/recruiter-dashboard/jobs/create-jobs",
        },
        {
          title: "Current Jobs",
          url: "/recruiter-dashboard/jobs/current-jobs",
        },
        {
          title: "Finished Jobs",
          url: "/recruiter-dashboard/jobs/finished-jobs",
        },
      ],
    },
  ],
}



export function RecruiterAppSidebar({
  ...props
}) {

  const router = useRouter()
  const { user, loading } = useRecruiter();
const handlerecruiterLogout = async () => {
  try {
    console.log("logout clicked")
    await fetch("http://localhost:3001/api/auth/recruiter-logout", {
      method: "POST",
      credentials: "include", // VERY IMPORTANT — includes your auth cookie
    });
    // redirect to login page
    router.push("/recruiter-login");
  } catch (err) {
    console.log("Logout error:", err);
  }
}
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="grid flex-1 text-left text-sm leading-tight">
            {loading ? (
              <>
                <span className="truncate font-medium">Loading...</span>
                <span className="truncate text-xs"></span>
              </>
            ) : (
              <>
                <span className="truncate font-medium">{user?.full_name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handlerecruiterLogout}>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
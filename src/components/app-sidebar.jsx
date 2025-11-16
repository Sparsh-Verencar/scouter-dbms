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
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Edit Profile",
          url: "#",
        },
      ],
    },
  ],
}



export function AppSidebar({
  ...props
}) {
  const router = useRouter()
  const { user, loading } = useUser();
  const handleFreelancerLogout = async () => {
    try {
      console.log("logout clicked")
      await fetch("http://localhost:3001/api/auth/freelancer-logout", {
        method: "POST",
        credentials: "include", // VERY IMPORTANT — includes your auth cookie
      });
      // redirect to login page
      router.push("/freelancer-login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  }
  async function deleteAccount() {
    const res = await fetch("http://localhost:3001/api/auth/freelancer-delete", {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      alert("Account deleted");
      router.push("/"); // redirect
    } else {
      alert(data.error || "Error deleting account");
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div
            className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
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
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleFreelancerLogout}>
            <DoorClosedIcon />
            <span>Logout</span>
          </SidebarMenuButton>
          <SidebarMenuButton onClick={deleteAccount}>
            <DoorClosedIcon />
            <span>Delete Account</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

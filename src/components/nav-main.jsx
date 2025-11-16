"use client"

import { ChevronRight, DoorClosedIcon, SettingsIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items
}) {
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
    <SidebarGroup>
      <SidebarGroupLabel>User info</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight
                    className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
      <SidebarMenu>
        <Collapsible
          asChild
          className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="settings">
                <SettingsIcon />
                <span>Settings</span>
                <ChevronRight
                  className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
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
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}

// src/app/freelancer-dashboard/page.jsx
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/ui/logout-button';
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

/**
 * Extract a raw cookie header string in a way that works across
 * Next/Turbopack / different runtimes. Returns "" if not found.
 */
function getRawCookieHeader() {
  // try headers() first
  try {
    const hdrs = headers();
    if (hdrs) {
      // preferred: headers().get('cookie')
      if (typeof hdrs.get === 'function') {
        const c = hdrs.get('cookie');
        if (c) return c;
      }
      // some runtimes expose cookie property
      if (typeof hdrs.cookie === 'string') return hdrs.cookie;
      // some runtimes support getAll
      if (typeof hdrs.getAll === 'function') {
        const arr = hdrs.getAll('cookie');
        if (Array.isArray(arr) && arr.length) return arr.join('; ');
        if (typeof arr === 'string' && arr) return arr;
      }
      // fallback: try stringify
      try {
        const s = String(hdrs || '');
        if (s && s.includes('=')) return s;
      } catch (e) { /* ignore */ }
    }
  } catch (e) {
    // continue to cookies() fallback
  }

  // try cookies() helper
  try {
    const cs = cookies();
    if (cs) {
      // cookieStore.get(name)
      if (typeof cs.get === 'function') {
        // attempt to reconstruct auth cookie if present
        const auth = cs.get('auth_token') || cs.get('authToken') || cs.get('auth');
        if (auth && typeof auth.value === 'string') return `auth_token=${auth.value}`;
      }
      // cookieStore.getAll()
      if (typeof cs.getAll === 'function') {
        const all = cs.getAll();
        if (Array.isArray(all) && all.length) {
          const joined = all.map(c => `${c.name}=${c.value}`).join('; ');
          if (joined) return joined;
        }
      }
      // try stringifying cookies()
      try {
        const s = String(cs || '');
        if (s && s.includes('=')) return s;
      } catch (e) { /* ignore */ }
    }
  } catch (e) {
    // give up
  }

  return '';
}

export default async function Page() {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // robustly get cookie header from incoming request
  const cookieHeader = getRawCookieHeader();

  // forward cookie header to backend to validate session
  const res = await fetch(`${API}/api/auth/me`, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect('/login');
  }

  const data = await res.json().catch(() => null);
  const user = data?.user || null;

  if (!user) redirect('/login');

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>

        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">

          <div className="flex items-center gap-2 px-4 w-full">

            <SidebarTrigger className="-ml-1" />

            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />

            <ModeToggle />

            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Jobs for you</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Job name</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Push user + logout to right */}
            <div className="ml-auto flex items-center gap-4">

              {/* Optional: show signed-in user's name or email */}
              <div className="text-sm hidden md:block">
                Signed in as{" "}
                <span className="font-medium">{user.name ?? user.email}</span>
              </div>

              {/* Logout button (client-side) */}
              <LogoutButton className="rounded px-3 py-1 text-sm border hover:bg-muted/10" />
            </div>

          </div>
        </header>

        {/* Dashboard content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>

          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>

      </SidebarInset>
    </SidebarProvider>
  );
}

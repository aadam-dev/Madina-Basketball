"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Calendar,
  ClipboardList,
  Eye,
  FileText,
  HeartHandshake,
  Home,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Megaphone,
  Menu,
  Trophy,
  UserCog,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";
import NotificationBell from "@/components/admin/NotificationBell";

type Item = { href: string; label: string; icon: typeof LayoutDashboard };

const GROUPS: { label: string; items: Item[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/impact", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Inbox",
    items: [
      { href: "/admin/registrations", label: "Registrations", icon: ClipboardList },
      { href: "/admin/join", label: "Join", icon: UserPlus },
      { href: "/admin/bookings", label: "Bookings", icon: Calendar },
      { href: "/admin/messages", label: "Messages", icon: Inbox },
      { href: "/admin/support", label: "Support", icon: HeartHandshake },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/admin/players", label: "Roster", icon: Users },
      { href: "/admin/staff", label: "Staff", icon: UserCog },
    ],
  },
  {
    label: "Court",
    items: [
      { href: "/admin/events", label: "Events", icon: Calendar },
      { href: "/admin/games", label: "Games", icon: Trophy },
      { href: "/admin/visits", label: "Visits", icon: Eye },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/content", label: "Content", icon: FileText },
      { href: "/admin/media", label: "Media", icon: ImageIcon },
      { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-7">
      {GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
            {group.label}
          </p>
          <div className="mt-2 space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                    active
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-white/40 group-hover:text-white/70"}`} />
                  <span className="font-medium tracking-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const local = email.split("@")[0] || email;

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[220px] flex-col bg-[#0f1115] px-2.5 py-4 md:flex">
        <Link href="/admin" className="mb-6 px-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Madina</p>
          <p className="mt-0.5 text-[15px] font-semibold tracking-tight text-white">Operations</p>
        </Link>
        <div className="flex-1 overflow-y-auto pb-4">
          <NavLinks pathname={pathname} />
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-950/45 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[220px] flex-col bg-[#0f1115] px-2.5 py-4 md:hidden ${
          open ? "flex" : "hidden"
        }`}
      >
        <div className="mb-5 flex items-center justify-between px-2.5">
          <p className="text-[15px] font-semibold tracking-tight text-white">Operations</p>
          <button type="button" onClick={() => setOpen(false)} className="text-white/70" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
        </div>
      </aside>

      <div className="md:pl-[220px]">
        <header className="sticky top-0 z-30 flex h-12 items-center justify-between gap-3 border-b border-slate-200/70 bg-[#f3f4f6]/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-white md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="text-sm text-slate-500">
              <span className="font-medium text-slate-800">{local}</span>
            </p>
          </div>
          <div className="flex items-center gap-1">
            <NotificationBell />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm text-slate-600 hover:bg-white hover:text-slate-900"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Site</span>
            </Link>
            <LogoutButton />
          </div>
        </header>
        <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">{children}</main>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  BarChart3, 
  MapPin, 
  Newspaper, 
  User as UserIcon, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const sidebarLinks = [
  { name: "Resumen", href: "/dashboard", icon: BarChart3, roles: ["user", "admin"] },
  { name: "Mis Denuncias", href: "/dashboard/denuncias", icon: MapPin, roles: ["user", "admin"] },
  { name: "Noticias", href: "/dashboard/noticias", icon: Newspaper, roles: ["admin"] },
  { name: "Perfil", href: "/dashboard/perfil", icon: UserIcon, roles: ["user", "admin"] },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/dashboard");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-foreground/[0.02] flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-border h-screen sticky top-0 flex flex-col pt-24 pb-12 px-6">
        <div className="flex items-center gap-4 mb-10 px-2">
           <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 text-white">
              <UserIcon size={24} />
           </div>
           <div className="overflow-hidden">
              <p className="font-title font-bold text-sm truncate">{user?.name}</p>
              <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-primary-500 tracking-widest">
                <ShieldCheck size={10} />
                <span>{user?.role}</span>
              </div>
           </div>
        </div>

        <nav className="flex-grow space-y-2">
          {sidebarLinks.filter(link => link.roles.includes(user?.role || "user")).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all group",
                  isActive 
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" 
                    : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <link.icon size={20} className={cn(!isActive && "group-hover:scale-110 transition-transform")} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-border space-y-2">
          <Link
            href="/dashboard/configuracion"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-foreground/50 hover:bg-foreground/5 hover:text-foreground transition-all"
          >
            <Settings size={20} />
            Configuración
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-red-500 hover:bg-red-500/10 transition-all text-left"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto px-8 md:px-12 pt-24 pb-20">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { Menu, X, User, MapPin, Newspaper, Home, LogIn } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navLinks = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Noticias", href: "/noticias", icon: Newspaper },
  { name: "Mapa", href: "/denuncias", icon: MapPin },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-3 bg-white",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
            <img 
              src="/favicon.ico?v=2" 
              alt="Logo Acción Alvarado" 
              className="w-8 h-8 object-contain"
            />
          </div>



          <span className="font-title font-bold text-xl tracking-tight hidden sm:block">
            Acción <span className="text-primary-500">Alvarado</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-medium transition-colors hover:text-primary-500 flex items-center gap-2",
                pathname === link.href ? "text-primary-500" : "text-foreground/70"
              )}
            >
              <link.icon size={18} />
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 font-medium text-foreground/70 hover:text-primary-500 transition-colors"
              >
                <User size={18} />
                {user?.name}
              </Link>
              <button
                onClick={logout}
                className="btn-primary py-2 text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden sm:flex items-center gap-2 font-medium text-foreground/70 hover:text-primary-500 transition-colors"
              >
                <LogIn size={18} />
                Ingresar
              </Link>
              <Link href="/auth/registro" className="btn-primary py-2 text-sm">
                Registrarse
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground/70 hover:text-primary-500 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 top-[64px] bg-background/95 backdrop-blur-lg z-40 md:hidden transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col p-6 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-2xl font-bold flex items-center gap-3",
                pathname === link.href ? "text-primary-500" : "text-foreground/70"
              )}
            >
              <link.icon size={24} />
              {link.name}
            </Link>
          ))}
          <hr className="border-border" />
          {!isAuthenticated && (
            <div className="flex flex-col gap-4">
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="text-xl font-bold text-foreground/70"
              >
                Ingresar
              </Link>
              <Link
                href="/auth/registro"
                onClick={() => setIsOpen(false)}
                className="btn-primary py-4 text-center text-lg"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

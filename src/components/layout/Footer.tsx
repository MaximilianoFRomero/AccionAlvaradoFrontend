import React from "react";
import Link from "next/link";
import { Facebook, Instagram } from "@/components/ui/BrandIcons";

export const Footer = () => {
  return (
    <footer className="w-full bg-card border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-title font-bold text-lg tracking-tight">
              Acción <span className="text-primary-500">Alvarado</span>
            </span>
          </Link>
          <p className="text-foreground/60 max-w-sm leading-relaxed">
            Trabajando juntos por un General Alvarado mejor. Tu voz es el motor de nuestro cambio. Reporta, participa y mantente informado.
          </p>
        </div>

        <div>
          <h4 className="font-title font-bold mb-6 text-foreground">Plataforma</h4>
          <ul className="space-y-4 text-foreground/60">
            <li>
              <Link href="/noticias" className="hover:text-primary-500 transition-colors">
                Noticias
              </Link>
            </li>
            <li>
              <Link href="/denuncias" className="hover:text-primary-500 transition-colors">
                Mapa de Denuncias
              </Link>
            </li>
            <li>
              <Link href="/denuncias/nueva" className="hover:text-primary-500 transition-colors">
                Nueva Denuncia
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-title font-bold mb-6 text-foreground">Contacto</h4>
          <ul className="space-y-4 text-foreground/60">
            <li>info@accionalvarado.org</li>
            <li>General Alvarado, Buenos Aires</li>
            <li className="flex gap-4 pt-2">
              <a href="https://www.facebook.com/profile.php?id=61558108684911" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center hover:bg-primary-500/20 transition-colors" title="Facebook">
                <Facebook size={18} className="text-primary-500" />
              </a>
              <a href="https://www.instagram.com/accion_alvarado/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center hover:bg-primary-500/20 transition-colors" title="Instagram">
                <Instagram size={18} className="text-primary-500" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border text-center text-foreground/40 text-sm">
        © {new Date().getFullYear()} Acción Alvarado. Todos los derechos reservados.
      </div>
    </footer>
  );
};

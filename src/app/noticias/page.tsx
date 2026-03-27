"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Newspaper, Clock } from "lucide-react";
import { NewsCard, NewsCardSkeleton } from "@/components/ui/NewsCard";
import { api } from "@/services/apiService";
import { Input } from "@/components/ui/Input";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  date: string;
  category: string;
}

export default function NoticiasPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get("/news");
        setNews(response.data);
      } catch (err) {
        console.error("Error al cargar noticias:", err);
        // Fallback or Mock data for visualization if API is not ready
        setNews([
          {
            id: "1",
            title: "Nueva propuesta de pavimentación para los barrios del Sur",
            excerpt: "La agrupación Acción Alvarado presentó un proyecto integral para mejorar la infraestructura vial en las zonas más postergadas de la ciudad.",
            date: "24 Mar 2026",
            category: "Propuestas",
            imageUrl: "https://imgs.search.brave.com/kXtuaXk6aj-H8RDm_Dbhpc50361W09u8ygvrTBk0l50/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Y2FudWVsYXMuZ292/LmFyL21lZGlhL2sy/L2l0ZW1zL2NhY2hl/LzcxNzg3YWVlY2Ew/ZGZiNTI1OTk0ZDhj/YzJmYWQ4YzgyX1hM/LmpwZw",
          },
          {
            id: "2",
            title: "Reunión vecinal exitosa en la Plaza Central",
            excerpt: "Más de 100 vecinos se acercaron a compartir sus inquietudes y conocer nuestras soluciones para el problema de la basura.",
            date: "22 Mar 2026",
            category: "Comunidad",
            imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1200",
          },
          {
            id: "3",
            title: "Informe: El estado de las cuentas municipales",
            excerpt: "Publicamos nuestro análisis detallado sobre el presupuesto del último año y proponemos mayor transparencia.",
            date: "20 Mar 2026",
            category: "Transparencia",
            imageUrl: "https://imgs.search.brave.com/ztlPZQqqZImleCNh4LNbO4ez1U8UFSPuQCOcCOxAaUU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyMC8w/Mi8yNS8wOS80NC9t/dW5pY2lwYWwtZWxl/Y3Rpb24tNDg3ODQw/NV9fMzQwLmpwZw",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12 mt-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-xs font-bold uppercase tracking-widest mb-4">
            <Newspaper size={14} />
            <span>Actualidad Institucional</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-title font-bold mb-4">
            Mantente informado sobre <br /> 
            <span className="gradient-text">General Alvarado</span>
          </h1>
          <p className="text-lg text-foreground/60 leading-relaxed">
            Descubre nuestras últimas actividades, propuestas legislativas y eventos comunitarios.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="w-full max-w-sm space-y-4">
          <Input 
            placeholder="Buscar noticias..." 
            leftIcon={<Search size={18} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            {["Todas", "Propuestas", "Comunidad", "Eventos"].map((cat) => (
              <button 
                key={cat}
                className="px-4 py-2 rounded-full border border-border text-xs font-bold text-foreground/50 hover:border-primary-500/30 hover:text-primary-500 transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-border" />

      {/* Featured News / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)
        ) : (
          filteredNews.map((item, index) => (
            <div 
              key={item.id} 
              className={index === 0 ? "md:col-span-2 lg:col-span-3" : ""}
            >
              <NewsCard 
                {...item} 
                featured={index === 0} 
              />
            </div>
          ))
        )}

        {/* Empty State */}
        {!isLoading && filteredNews.length === 0 && (
          <div className="col-span-full py-20 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-foreground/5 text-foreground/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} />
            </div>
            <h3 className="text-2xl font-title font-bold mb-2">No encontramos resultados</h3>
            <p className="text-foreground/60 max-w-sm mx-auto">
              Intenta cambiar los términos de búsqueda o selecciona otra categoría.
            </p>
          </div>
        )}
      </div>

      {/* Newsletter / CTA Section */}
      <div className="mt-12 glass p-10 md:p-16 rounded-[3rem] border flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 -z-10 blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        
        <div className="max-w-md text-center md:text-left">
          <h2 className="text-3xl font-title font-bold mb-4 text-white">¿Quieres recibir las novedades en tu email?</h2>
          <p className="text-white/70 leading-relaxed mb-0">
            Suscríbete a nuestro boletín semanal y no te pierdas nada de lo que sucede en Alvarado.
          </p>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-4">
          <Input placeholder="tu@email.com" containerClassName="w-full" />
          <button className="btn-primary py-4 text-center font-bold">Suscribirme Ahora</button>
          <p className="text-[10px] text-foreground/30 text-center">
            Prometemos no enviar spam. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Calendar, ArrowLeft, Share2, Globe, Link as LinkIcon, ChevronRight } from "lucide-react";
import { api } from "@/services/apiService";
import { Button } from "@/components/ui/Button";
import { Facebook, XLogo } from "@/components/ui/BrandIcons";


interface NewsDetail {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  date: string;
  category: string;
  author?: string;
}

export default function NoticiaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [noticia, setNoticia] = useState<NewsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const response = await api.get(`/news/${id}`);
        setNoticia(response.data);
      } catch (err) {
        console.error("Error al cargar la noticia:", err);
        // Fallback Mock Data
        setNoticia({
          id: id as string,
          title: "Nueva propuesta de pavimentación para los barrios del Sur",
          date: "24 Mar 2026",
          category: "Propuestas",
          author: "Agrupación Acción Alvarado",
          imageUrl: "https://images.unsplash.com/photo-1590486803833-ffc6f08d533b?auto=format&fit=crop&q=80&w=1200",
          content: `
            <p className="mb-6">La agrupación Acción Alvarado ha presentado en el día de hoy un ambicioso proyecto de pavimentación integral destinado a los barrios de la zona sur de Miramar y las localidades aledañas del partido de General Alvarado.</p>
            <p className="mb-6">El plan contempla no solo el asfaltado de arterias principales, sino también el replanteo hidráulico necesario para evitar inundaciones recurrentes que afectan a cientos de familias cada invierno. "No se trata solo de tirar piedra y brea, se trata de hacer obras que duren 50 años", declaró el equipo técnico durante la presentación.</p>
            <h3 className="text-2xl font-title font-bold mb-4">Puntos clave del proyecto:</h3>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>Pavimentación de más de 40 cuadras estratégicas.</li>
              <li>Instalación de luminarias LED de bajo consumo.</li>
              <li>Mejora en los desagües pluviales.</li>
              <li>Señalización vial y creación de rampas de accesibilidad.</li>
            </ul>
            <p className="mb-6">Se estima que la inversión permitirá mejorar la conectividad de los centros de salud y escuelas de la periferia, reduciendo los tiempos de traslado y mejorando la seguridad vial de manera sustancial. El proyecto será presentado en la próxima sesión ordinaria del Concejo Deliberante para su tratamiento por parte de todas las fuerzas políticas.</p>
          `,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchNoticia();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 mt-10 animate-pulse">
        <div className="h-96 bg-foreground/5 rounded-[3rem] mb-12" />
        <div className="space-y-6">
          <div className="h-12 w-3/4 bg-foreground/5 rounded-full" />
          <div className="h-8 w-1/4 bg-foreground/5 rounded-full" />
          <div className="pt-10 space-y-4">
             <div className="h-6 w-full bg-foreground/5 rounded-full" />
             <div className="h-6 w-full bg-foreground/5 rounded-full" />
             <div className="h-6 w-2/3 bg-foreground/5 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!noticia) return null;

  return (
    <article className="max-w-7xl mx-auto px-0 md:px-6 py-12 flex flex-col gap-12 mt-10">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[75vh] w-full md:rounded-[3rem] overflow-hidden group shadow-2xl">
        {noticia.imageUrl ? (
          <Image
            src={noticia.imageUrl}
            alt={noticia.title}
            fill
            className="object-cover transition-transform duration-[2000ms] scale-100 group-hover:scale-110"
            priority
          />
        ) : (
          <div className="w-full h-full bg-primary-500/10 flex items-center justify-center">
            <span className="text-primary-500/20 font-bold text-8xl">AA</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-12 left-6 md:left-12 right-6 md:right-12 text-white">
          <div className="flex flex-wrap items-center gap-4 mb-6">
             <span className="px-4 py-1.5 rounded-full glass border border-white/20 text-xs font-bold uppercase tracking-widest">
               {noticia.category}
             </span>
             <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                <Calendar size={16} />
                <span>{noticia.date}</span>
             </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-title font-bold leading-tight mb-4 drop-shadow-lg">
            {noticia.title}
          </h1>
          <p className="text-lg text-white/60 font-medium">Por: {noticia.author}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Content Section */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-primary-500 mb-2">
            <ChevronRight size={16} />
            <span>Actualidad y propuestas</span>
          </div>
          
          <div 
            className="prose prose-lg dark:prose-invert prose-primary max-w-none text-foreground/80 leading-loose"
            dangerouslySetInnerHTML={{ __html: noticia.content }}
          />

          <hr className="border-border mt-8" />

          {/* Social Share */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6">
             <span className="text-sm font-bold text-foreground/40 uppercase tracking-widest">Comparte esta noticia</span>
             <div className="flex gap-4">
                {[
                  { icon: Facebook, color: "hover:bg-[#1877F2]/10 hover:text-[#1877F2]" },
                  { icon: XLogo, color: "hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground" },

                  { icon: LinkIcon, color: "hover:bg-primary-500/10 hover:text-primary-500" },
                ].map((social, i) => (
                  <button key={i} className={`w-12 h-12 rounded-2xl glass border flex items-center justify-center transition-all ${social.color}`}>
                    <social.icon size={20} />
                  </button>
                ))}
                <button className="flex items-center gap-2 px-6 py-2 rounded-2xl glass border font-bold text-sm hover:border-primary-500/30 transition-all">
                  <Share2 size={18} /> Compartir
                </button>
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="glass p-8 rounded-[2.5rem] border sticky top-24">
              <h4 className="font-title font-bold text-xl mb-6">Contenido relacionado</h4>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <Link key={i} href="#" className="flex flex-col gap-2 group">
                    <span className="text-[10px] font-bold text-primary-500 uppercase">20 Mar 2026</span>
                    <h5 className="font-bold text-sm leading-tight group-hover:text-primary-500 transition-colors">
                      Título sugerido para lectura adicional sobre la agrupación.
                    </h5>
                  </Link>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-8" onClick={() => router.push("/noticias")}>
                Todas las noticias
              </Button>
           </div>
        </div>
      </div>
    </article>
  );
}

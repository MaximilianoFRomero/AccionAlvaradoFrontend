"use client";

import React, { useState, useEffect } from "react";
import { 
  Search as SearchIcon, 
  Plus as PlusIcon, 
  Edit2 as EditIcon, 
  Trash2 as TrashIcon, 
  Eye as EyeIcon, 
  MoreVertical as MoreIcon,
  Newspaper as NewsIcon,
  Calendar as CalIcon,
  CheckCircle2 as CheckIcon
} from "lucide-react";
import Link from "next/link";
import { api } from "@/services/apiService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";

interface NewsAdminItem {
  id: string;
  title: string;
  category: string;
  date: string;
  status: "publicado" | "borrador";
}

export default function AdminNoticiasPage() {
  const [news, setNews] = useState<NewsAdminItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get("/news");
        setNews(response.data);
      } catch (err) {
        console.error("Error al cargar noticias:", err);
        // Fallback Mock Data
        setNews([
          { id: "1", title: "Nueva propuesta de pavimentación para los barrios del Sur", category: "Propuestas", date: "24 Mar 2026", status: "publicado" },
          { id: "2", title: "Reunión vecinal exitosa en la Plaza Central", category: "Comunidad", date: "22 Mar 2026", status: "publicado" },
          { id: "3", title: "Informe: El estado de las cuentas municipales", category: "Transparencia", date: "20 Mar 2026", status: "borrador" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (user?.role !== "admin") {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">No tienes permisos para ver esta página</h2>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-title font-bold mb-2 tracking-tight">Gestión de Noticias</h1>
          <p className="text-foreground/60 leading-relaxed max-w-lg">
            Crea, edita y publica las novedades de la agrupación para mantener informada a la comunidad.
          </p>
        </div>
        <Link href="/dashboard/noticias/nueva">
          <Button className="py-4 px-8" rightIcon={<PlusIcon size={20} />}>
            Crear Noticia
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="w-full max-w-sm">
            <Input 
              placeholder="Filtrar por título..." 
              leftIcon={<SearchIcon size={18} />}
            />
         </div>
         <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-full text-xs font-bold text-foreground/50 hover:border-primary-500/30 transition-all">
               Publicados
            </button>
            <button className="px-4 py-2 border rounded-full text-xs font-bold text-foreground/50 hover:border-primary-500/30 transition-all">
               Borradores
            </button>
         </div>
      </div>

      {/* Admin List */}
      <div className="glass rounded-[2rem] border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-foreground/[0.02] border-b border-border">
            <tr>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-foreground/40">Noticia</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-foreground/40 hidden md:table-cell">Categoría</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-foreground/40 hidden lg:table-cell">Estado</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-foreground/40 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
               Array.from({ length: 3 }).map((_, i) => (
                 <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6"><div className="h-6 w-3/4 bg-foreground/5 rounded-full" /></td>
                    <td className="px-8 py-6 hidden md:table-cell"><div className="h-4 w-20 bg-foreground/5 rounded-full" /></td>
                    <td className="px-8 py-6 hidden lg:table-cell"><div className="h-4 w-16 bg-foreground/5 rounded-full" /></td>
                    <td className="px-8 py-6"><div className="h-8 w-8 bg-foreground/5 rounded-full ml-auto" /></td>
                 </tr>
               ))
            ) : (
              news.map((item) => (
                <tr key={item.id} className="hover:bg-foreground/[0.01] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center shrink-0">
                          <NewsIcon size={20} />
                       </div>
                       <div>
                          <p className="font-bold text-sm leading-tight mb-1 group-hover:text-primary-500 transition-colors">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                             <CalIcon size={12} />
                             <span>{item.date}</span>
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell">
                    <span className="text-xs font-bold text-foreground/60">{item.category}</span>
                  </td>
                  <td className="px-8 py-6 hidden lg:table-cell">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                      item.status === 'publicado' ? 'bg-green-500/10 text-green-500' : 'bg-foreground/5 text-foreground/40'
                    }`}>
                      <CheckIcon size={12} />
                      {item.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-3 hover:bg-primary-500/10 hover:text-primary-500 rounded-2xl transition-all" title="Ver">
                          <EyeIcon size={18} />
                       </button>
                       <button className="p-3 hover:bg-blue-500/10 hover:text-blue-500 rounded-2xl transition-all" title="Editar">
                          <EditIcon size={18} />
                       </button>
                       <button className="p-3 hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all" title="Eliminar">
                          <TrashIcon size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {!isLoading && news.length === 0 && (
           <div className="py-20 text-center">
              <NewsIcon size={48} className="mx-auto text-foreground/10 mb-4" />
              <p className="text-foreground/40 font-bold">No hay noticias publicadas aún.</p>
           </div>
        )}
      </div>
    </div>
  );
}

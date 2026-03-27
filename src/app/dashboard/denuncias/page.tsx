"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Plus,
  Filter
} from "lucide-react";
import Link from "next/link";
import { api } from "@/services/apiService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface UserComplaint {
  id: string;
  description: string;
  category: string;
  status: "pendiente" | "en proceso" | "resuelto";
  createdAt: string;
}

export default function MisDenunciasPage() {
  const [complaints, setComplaints] = useState<UserComplaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        const response = await api.get("/complaints/user"); // Assuming an endpoint for user-specific reports
        setComplaints(response.data);
      } catch (err) {
        console.error("Error al cargar tus denuncias:", err);
        // Fallback Mock Data
        setComplaints([
          { id: "1", description: "Bache profundo en Calle 27 e/ 24 y 22", category: "Calles", status: "en proceso", createdAt: "24 Mar 2026" },
          { id: "2", description: "Falta de iluminación en la plaza del barrio sur", category: "Luminarias", status: "pendiente", createdAt: "20 Mar 2026" },
          { id: "3", description: "Cables caídos tras la tormenta", category: "Seguridad", status: "resuelto", createdAt: "15 Mar 2026" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyComplaints();
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pendiente": return { color: "text-amber-500", bg: "bg-amber-500/10", icon: AlertCircle, label: "Pendiente" };
      case "en proceso": return { color: "text-blue-500", bg: "bg-blue-500/10", icon: Clock, label: "En Proceso" };
      case "resuelto": return { color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle2, label: "Resuelto" };
      default: return { color: "text-foreground/40", bg: "bg-foreground/5", icon: AlertCircle, label: status };
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-title font-bold mb-2 tracking-tight">Mis Denuncias</h1>
          <p className="text-foreground/60 leading-relaxed max-w-lg">
            Gestiona y haz un seguimiento de todos los reportes que has enviado. Juntos mejoramos la ciudad.
          </p>
        </div>
        <div className="flex gap-4">
           <Link href="/denuncias/nueva">
             <Button className="py-4 px-8" rightIcon={<Plus size={20} />}>
               Crear Reporte
             </Button>
           </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="w-full max-w-sm">
            <Input 
              placeholder="Buscar por descripción..." 
              leftIcon={<Search size={18} />}
            />
         </div>
         <div className="flex gap-2 self-start md:self-auto">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-bold text-foreground/50 hover:border-primary-500/30 transition-all">
               <Filter size={14} /> Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-bold text-foreground/50 hover:border-primary-500/30 transition-all">
               Más Recientes
            </button>
         </div>
      </div>

      {/* List Table (Mobile as Cards) */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="glass p-8 rounded-[2rem] border animate-pulse flex items-center gap-6">
                <div className="w-16 h-16 bg-foreground/5 rounded-2xl" />
                <div className="flex-grow space-y-3">
                   <div className="h-6 w-1/2 bg-foreground/5 rounded-full" />
                   <div className="h-4 w-1/4 bg-foreground/5 rounded-full" />
                </div>
             </div>
          ))
        ) : (
          complaints.map((item) => {
            const status = getStatusInfo(item.status);
            return (
              <div key={item.id} className="glass p-6 md:p-8 rounded-[2rem] border flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-500">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-20 h-20 bg-foreground/5 rounded-[1.5rem] flex items-center justify-center overflow-hidden shrink-0">
                    <MapPin size={32} className="text-foreground/10 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h5 className="text-lg font-bold mb-1 leading-tight">{item.description}</h5>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-foreground/40">
                      <span className="text-primary-500">{item.category}</span>
                      <span>•</span>
                      <span>ID: #{item.id}</span>
                      <span>•</span>
                      <span>{item.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-12 pt-4 md:pt-0 border-t md:border-t-0 border-border">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${status.bg} ${status.color} font-bold text-xs uppercase tracking-widest`}>
                    <status.icon size={14} />
                    {status.label}
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="text-sm font-bold text-foreground/40 hover:text-primary-500 transition-colors px-4 py-2">
                        Detalles
                     </button>
                     <button className="p-3 hover:bg-foreground/5 rounded-2xl transition-colors">
                        <MoreVertical size={20} className="text-foreground/30" />
                     </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-center gap-4 py-6">
         <button className="p-3 rounded-2xl border text-foreground/30 disabled:opacity-30" disabled>Anterior</button>
         <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-primary-500 text-white font-bold">1</button>
            <button className="w-10 h-10 rounded-xl border font-bold text-foreground/50">2</button>
         </div>
         <button className="p-3 rounded-2xl border font-bold text-foreground/60">Siguiente</button>
      </div>
    </div>
  );
}

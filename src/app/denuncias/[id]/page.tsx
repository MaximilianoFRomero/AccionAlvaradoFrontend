"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, 
  Calendar, 
  User, 
  Tag, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import dynamic from "next/dynamic";
import { api } from "@/services/apiService";
import { Button } from "@/components/ui/Button";

// Dynamic Map for detail view
const MapContainer = dynamic(() => import("@/components/map/MapContainer"), { ssr: false });

interface ComplaintDetail {
  id: string;
  description: string;
  category: string;
  status: "pendiente" | "en proceso" | "resuelto";
  createdAt: string;
  lat: number;
  lng: number;
  userName?: string;
  imageUrl?: string;
}

export default function DenunciaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/complaints/${id}`);
        setComplaint(response.data);
      } catch (err) {
        console.error("Error al cargar detalle de denuncia:", err);
        // Fallback Mock Data
        setComplaint({
          id: id as string,
          description: "Bache profundo en Av. Colón y calle 24. El pozo afecta a dos carriles y ha causado daños en vehículos durante la última semana.",
          category: "Calles",
          status: "en proceso",
          createdAt: "24 Mar 2026",
          lat: -38.2731,
          lng: -57.8404,
          userName: "Juan Pérez",
          imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=1200",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) return <div className="p-20 text-center animate-pulse">Cargando reporte...</div>;
  if (!complaint) return null;

  const statusMap = {
    pendiente: { color: "text-amber-500", bg: "bg-amber-500/10", icon: AlertCircle, label: "Pendiente" },
    "en proceso": { color: "text-blue-500", bg: "bg-blue-500/10", icon: Clock, label: "En Proceso" },
    resuelto: { color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle2, label: "Resuelto" },
  };

  const status = statusMap[complaint.status];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12 mt-10">
      {/* Header & Back */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
           <button onClick={() => router.back()} className="flex items-center gap-2 text-primary-500 font-bold hover:translate-x-[-4px] transition-transform">
              <ArrowLeft size={20} />
              Volver al listado
           </button>
           <div className="flex items-center gap-4">
              <h1 className="text-4xl font-title font-bold">Reporte #{complaint.id}</h1>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} ${status.color} text-xs font-bold uppercase tracking-widest`}>
                <status.icon size={14} />
                {status.label}
              </div>
           </div>
        </div>
        <div className="flex gap-4">
           {/* Actions button */}
           <Button variant="outline">Validar reporte</Button>
           <Button>Compartir</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Details & Media */}
        <div className="lg:col-span-7 space-y-12">
           <div className={complaint.imageUrl ? "h-96" : "h-0 invisible"}>
              {complaint.imageUrl && (
                 <div className="relative w-full h-full rounded-[3rem] overflow-hidden border shadow-xl">
                    <img src={complaint.imageUrl} alt="Evidencia" className="w-full h-full object-cover" />
                 </div>
              )}
           </div>

           <div className="glass p-10 rounded-[2.5rem] border space-y-8">
              <div className="space-y-4">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/40">Descripción del problema</h3>
                 <p className="text-xl leading-relaxed text-foreground/80">"{complaint.description}"</p>
              </div>

              <hr className="border-border" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-foreground/40 uppercase">Categoría</p>
                    <div className="flex items-center gap-2 font-bold text-primary-500">
                       <Tag size={16} />
                       <span>{complaint.category}</span>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-foreground/40 uppercase">Fecha</p>
                    <div className="flex items-center gap-2 font-bold">
                       <Calendar size={16} />
                       <span>{complaint.createdAt}</span>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-foreground/40 uppercase">Reportado por</p>
                    <div className="flex items-center gap-2 font-bold">
                       <User size={16} />
                       <span>{complaint.userName || "Anónimo"}</span>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-foreground/40 uppercase">Ubicación</p>
                    <div className="flex items-center gap-2 font-bold">
                       <MapPin size={16} />
                       <span>Gral. Alvarado</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Interaction & Map */}
        <div className="lg:col-span-5 space-y-8">
           <div className="h-[400px] rounded-[3rem] overflow-hidden border-4 border-card shadow-2xl relative">
              <MapContainer 
                center={[complaint.lat, complaint.lng]} 
                zoom={16}
                selectedPosition={[complaint.lat, complaint.lng]}
              />
              <div className="absolute top-4 left-4 z-10 glass px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl">
                 Ubicación Georeferenciada
              </div>
           </div>

           <div className="glass p-8 rounded-[2.5rem] border bg-primary-500/5 border-primary-500/10">
              <h4 className="font-title font-bold mb-4">Estado de resolución</h4>
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-10 h-10 bg-primary-500/20 text-primary-500 rounded-full flex items-center justify-center">
                    <Clock size={20} />
                 </div>
                 <div>
                    <p className="text-sm font-bold">Última actualización</p>
                    <p className="text-xs text-foreground/50">El equipo técnico está evaluando los costos.</p>
                 </div>
              </div>
              <Button variant="outline" className="w-full">Reportar irregularidad en este caso</Button>
           </div>
        </div>
      </div>
    </div>
  );
}

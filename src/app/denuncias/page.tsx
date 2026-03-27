"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, Plus, Filter, Info } from "lucide-react";
import Link from "next/link";
import { api } from "@/services/apiService";
import { Button } from "@/components/ui/Button";

// Dynamic import of the map component to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("@/components/map/MapContainer"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-foreground/5 animate-pulse flex items-center justify-center">
        <p className="text-foreground/40 font-medium">Cargando mapa interactivo...</p>
      </div>
    )
  }
);

const ComplaintMarker = dynamic(
  () => import("@/components/map/ComplaintMarker").then(mod => mod.ComplaintMarker),
  { ssr: false }
);

interface Complaint {
  id: string;
  lat: number;
  lng: number;
  description: string;
  category: string;
  status: string;
  address?: string;
}

export default function DenunciasPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/complaints");
        setComplaints(response.data);
      } catch (err) {
        console.error("Error al cargar denuncias:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden">
      {/* Sidebar / Info Panel */}
      <div className="absolute top-6 left-6 z-10 w-full max-w-xs space-y-4 pointer-events-none">
        <div className="glass p-6 rounded-3xl border shadow-xl pointer-events-auto animate-in slide-in-from-left-10 duration-700">
          <h1 className="text-2xl font-title font-bold mb-2 flex items-center gap-2">
            <MapPin className="text-primary-500" />
            Mapa de Denuncias
          </h1>
          <p className="text-sm text-foreground/60 mb-6 leading-relaxed">
            Reportes reales de los vecinos de General Alvarado. Ayúdanos a identificar problemas en tu zona.
          </p>
          
          <div className="space-y-4">
            <Link href="/denuncias/nueva" className="w-full block">
              <Button className="w-full py-4 text-base" rightIcon={<Plus size={18} />}>
                Nueva Denuncia
              </Button>
            </Link>
            
            <hr className="border-border" />
            
            <div className="flex items-center justify-between text-xs font-bold text-foreground/40 uppercase tracking-widest">
              <span>Leyenda</span>
              <Filter size={14} className="cursor-pointer hover:text-primary-500 transition-colors" />
            </div>
            
            <div className="space-y-3">
              {[
                { label: "Baches / Calles", color: "bg-red-500" },
                { label: "Basura / Higiene", color: "bg-green-500" },
                { label: "Alumbrado", color: "bg-yellow-500" },
                { label: "Seguridad", color: "bg-blue-500" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-foreground/70 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="glass p-4 rounded-2xl border shadow-lg pointer-events-auto animate-in slide-in-from-left-10 duration-700 delay-200">
          <div className="flex items-center gap-2 text-xs font-bold text-primary-500 uppercase">
            <Info size={14} />
            <span>Resumen de impacto</span>
          </div>
          <p className="mt-2 text-sm font-bold">
            <span className="text-2xl font-title gradient-text">{complaints.length}</span> reportes activos
          </p>
        </div>
      </div>

      {/* Map Rendering */}
      <div className="absolute inset-0 z-0">
        <MapContainer>
          {complaints.map((complaint) => (
            <ComplaintMarker key={complaint.id} complaint={complaint} />
          ))}
        </MapContainer>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="md:hidden absolute bottom-8 right-8 z-10">
        <Link href="/denuncias/nueva">
          <button className="w-16 h-16 bg-primary-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
            <Plus size={32} />
          </button>
        </Link>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  MoreVertical,
  Plus,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";

const stats = [
  { label: "Denuncias Realizadas", value: "12", icon: MapPin, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "En Proceso", value: "4", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { label: "Resueltas", value: "8", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Nivel de Impacto", value: "Alto", icon: TrendingUp, color: "text-primary-500", bg: "bg-primary-500/10" },
];

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-title font-bold mb-2">Resumen de Actividad</h1>
          <p className="text-foreground/60">Hola, {user?.name}. Aquí tienes un resumen de tus reportes y su estado.</p>
        </div>
        <Link href="/denuncias/nueva">
          <Button className="py-4 px-8" rightIcon={<Plus size={20} />}>
            Nueva Denuncia
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-[2rem] border hover:shadow-xl transition-all duration-500">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1">{stat.label}</p>
            <p className="text-3xl font-title font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Reports */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-title font-bold flex items-center gap-2">
              <Clock size={20} className="text-primary-500" />
              Ultimas denuncias
            </h3>
            <Link href="/dashboard/denuncias" className="text-sm font-bold text-primary-500 hover:underline">
              Ver todas
            </Link>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass p-6 rounded-3xl border flex items-center justify-between group hover:border-primary-500/30 transition-all duration-300">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-foreground/5 rounded-2xl flex items-center justify-center overflow-hidden">
                    {/* Placeholder image */}
                    <MapPin size={24} className="text-foreground/20" />
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">Bache profundo en Av. Colón</h5>
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-foreground/40">
                      <span className="text-red-500">Calles</span>
                      <span>•</span>
                      <span>Hace 2 días</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline-block px-3 py-1 rounded-md bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-widest">
                    En Proceso
                  </span>
                  <button className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
                    <MoreVertical size={20} className="text-foreground/30" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Impact / Alerts */}
        <div className="space-y-6">
          <h3 className="text-xl font-title font-bold flex items-center gap-2">
            <AlertCircle size={20} className="text-primary-500" />
            Alertas de tu zona
          </h3>
          <div className="glass p-8 rounded-[2.5rem] border border-primary-500/20 bg-primary-500/[0.02]">
            <div className="flex items-center gap-2 text-xs font-bold text-primary-500 uppercase tracking-widest mb-4">
               <TrendingUp size={14} />
               <span>Impacto positivo</span>
            </div>
            <h4 className="font-bold text-lg mb-4">¡Tus reportes están ayudando!</h4>
            <p className="text-sm text-foreground/60 leading-relaxed mb-6">
              Varios vecinos han validado tus denuncias sobre luminarias. Gracias a tu reporte, la municipalidad ha incluido el barrio 21 en la próxima etapa de reparaciones.
            </p>
            <div className="flex items-center gap-2 text-primary-500 font-bold text-sm">
               Seguir participando <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

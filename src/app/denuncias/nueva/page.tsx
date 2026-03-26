"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, ArrowRight, ArrowLeft, Camera, Send, Check } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/services/apiService";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Dynamic Map
const MapContainer = dynamic(() => import("@/components/map/MapContainer"), { ssr: false });

const complaintSchema = z.object({
  category: z.string().min(1, "Selecciona una categoría"),
  description: z.string().min(10, "Describe el problema con al menos 10 caracteres"),
  lat: z.number(),
  lng: z.number(),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

const categories = [
  { id: "calles", label: "Baches / Calles", color: "bg-red-500" },
  { id: "basura", label: "Basura / Limpieza", color: "bg-green-500" },
  { id: "luminarias", label: "Alumbrado Público", color: "bg-yellow-500" },
  { id: "seguridad", label: "Seguridad / Otros", color: "bg-blue-500" },
];

export default function NuevaDenunciaPage() {
  const [step, setStep] = useState(1);
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
  });

  const selectedCategory = watch("category");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/denuncias/nueva");
    }
  }, [isAuthenticated, router]);

  const onMapClick = (e: any) => {
    const { lat, lng } = e.latlng;
    setCoords([lat, lng]);
    setValue("lat", lat);
    setValue("lng", lng);
  };

  const onSubmit = async (data: ComplaintFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/complaints", data);
      setStep(3); // Success step
      setTimeout(() => router.push("/denuncias"), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al enviar la denuncia.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 mt-10">
        <div className="text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={48} strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-title font-bold mb-4">¡Denuncia Enviada!</h1>
          <p className="text-foreground/60 max-w-sm mx-auto">
            Gracias por participar. Tu reporte ha sido registrado y será moderado a la brevedad.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8 mt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-title font-bold">Reportar Problema</h1>
          <p className="text-foreground/60">Sigue los pasos para registrar una nueva denuncia urbana.</p>
        </div>
        
        {/* Progress Stepper */}
        <div className="flex items-center gap-2">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                step >= s ? "bg-primary-500 text-white" : "bg-foreground/5 text-foreground/40"
              )}>
                {s}
              </div>
              {s === 1 && <div className={cn("w-12 h-1 bg-foreground/5 rounded-full overflow-hidden", step > 1 && "bg-primary-500")} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Step 1: Map Picker */}
        <div className={cn(
          "lg:col-span-3 h-[500px] relative rounded-[2.5rem] overflow-hidden border-4 border-card shadow-2xl transition-all duration-500",
          step === 2 && "opacity-40 pointer-events-none grayscale scale-95"
        )}>
          <MapContainer onClick={onMapClick} zoom={15} selectedPosition={coords} />
          
          <div className="absolute top-6 left-6 z-10 glass p-4 rounded-2xl max-w-[240px]">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-1">Paso 1</p>
            <p className="text-sm font-medium">Toca el mapa para ubicar el problema de forma exacta.</p>
          </div>

          <div className="absolute bottom-6 right-6 z-10">
            {coords && (
              <Button onClick={() => setStep(2)} rightIcon={<ArrowRight size={18} />}>
                Siguiente Paso
              </Button>
            )}
          </div>
        </div>

        {/* Step 2: Form */}
        <div className={cn(
          "lg:col-span-2 space-y-8 animate-in slide-in-from-right-10 duration-500 delay-200",
          step === 1 && "opacity-40 pointer-events-none"
        )}>
          <div className="glass p-8 md:p-10 rounded-[2.5rem] border">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground/70 ml-1 uppercase tracking-wider">Categoría</label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setValue("category", cat.id)}
                      className={cn(
                        "p-4 rounded-2xl border-2 text-left transition-all duration-300",
                        selectedCategory === cat.id 
                          ? "border-primary-500 bg-primary-500/5 shadow-md" 
                          : "border-border hover:border-primary-500/30"
                      )}
                    >
                      <div className={cn("w-3 h-3 rounded-full mb-3", cat.color)} />
                      <span className="text-sm font-bold block leading-tight">{cat.label}</span>
                    </button>
                  ))}
                </div>
                {errors.category && <p className="text-xs text-red-500 font-bold ml-1">{errors.category.message}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground/70 ml-1 uppercase tracking-wider">Descripción del problema</label>
                <textarea
                  {...register("description")}
                  placeholder="Explica qué está sucediendo..."
                  className={cn(
                    "w-full min-h-[140px] bg-background border-2 border-border rounded-2xl p-4 text-base transition-all duration-300 outline-none",
                    "focus:border-primary-500 focus:shadow-lg focus:shadow-primary-500/10",
                    errors.description && "border-red-500"
                  )}
                />
                {errors.description && <p className="text-xs text-red-500 font-bold ml-1">{errors.description.message}</p>}
              </div>

              {/* Image Upload Placeholder */}
              <div className="p-6 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-foreground/40 hover:text-primary-500 hover:border-primary-500/30 transition-all cursor-pointer">
                <Camera size={32} className="mb-4" />
                <span className="text-sm font-bold">Subir foto del problema</span>
                <span className="text-xs">(Opcional, máx 5MB)</span>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-2xl">
                  {error}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setStep(1)}
                  leftIcon={<ArrowLeft size={18} />}
                >
                  Volver
                </Button>
                <Button 
                  type="submit" 
                  className="flex-[2]" 
                  isLoading={isLoading}
                  rightIcon={<Send size={18} />}
                >
                  Enviar Reporte
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

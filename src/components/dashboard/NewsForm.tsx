"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, ArrowLeft, Image as ImageIcon, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api } from "@/services/apiService";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const newsSchema = z.object({
  title: z.string().min(10, "El título debe tener al menos 10 caracteres"),
  category: z.string().min(1, "Selecciona una categoría"),
  excerpt: z.string().min(20, "El resumen debe ser descriptivo (mín 20 chars)"),
  content: z.string().min(50, "El contenido es demasiado corto"),
  imageUrl: z.string().url("Ingresa una URL de imagen válida").optional().or(z.literal("")),
});

type NewsFormValues = z.infer<typeof newsSchema>;

interface NewsFormProps {
  initialData?: NewsFormValues & { id: string };
  isEditing?: boolean;
}

export const NewsForm = ({ initialData, isEditing = false }: NewsFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: initialData || {
      title: "",
      category: "",
      excerpt: "",
      content: "",
      imageUrl: "",
    },
  });

  const previewImage = watch("imageUrl");

  const onSubmit = async (data: NewsFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await api.patch(`/news/${initialData?.id}`, data);
      } else {
        await api.post("/news", data);
      }
      router.push("/dashboard/noticias");
    } catch (err: any) {
      setError(err.response?.data?.message || "Ocurrió un error al guardar la noticia.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 mt-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
           onClick={() => router.back()}
           className="p-3 hover:bg-foreground/5 rounded-2xl transition-all text-foreground/50 hover:text-foreground flex items-center gap-2 font-bold text-sm"
        >
          <ArrowLeft size={18} />
          Volver
        </button>
        <h2 className="text-3xl font-title font-bold">
           {isEditing ? "Editar Noticia" : "Publicar Nueva Noticia"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Column */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-8 space-y-6">
           <div className="glass p-8 md:p-10 rounded-[2.5rem] border space-y-6">
              <Input 
                label="Título de la Noticia" 
                placeholder="Ej: Lanzamiento del plan vial..."
                error={errors.title?.message}
                {...register("title")}
              />

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/70 ml-1">Categoría</label>
                    <select 
                      {...register("category")}
                      className={cn(
                        "w-full bg-background border-2 border-border rounded-2xl px-4 py-3 outline-none focus:border-primary-500 transition-all cursor-pointer appearance-none",
                        errors.category && "border-red-500"
                      )}
                    >
                      <option value="">Selecciona...</option>
                      <option value="Propuestas">Propuestas</option>
                      <option value="Comunidad">Comunidad</option>
                      <option value="Comunicados">Comunicados</option>
                      <option value="Eventos">Eventos</option>
                    </select>
                    {errors.category && <p className="text-xs text-red-500 ml-1 mt-0.5">{errors.category.message}</p>}
                 </div>
                 <Input 
                  label="URL de Imagen" 
                  placeholder="https://..."
                  error={errors.imageUrl?.message}
                  {...register("imageUrl")}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/70 ml-1">Resumen (Excerpt)</label>
                <textarea 
                  {...register("excerpt")}
                  placeholder="Breve descripción para la previsualización..."
                  className="w-full bg-background border-2 border-border rounded-2xl p-4 min-h-[100px] outline-none focus:border-primary-500 transition-all"
                />
                {errors.excerpt && <p className="text-xs text-red-500 ml-1 mt-0.5">{errors.excerpt.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/70 ml-1">Contenido Completo (HTML Soportado)</label>
                <div className="relative group">
                   <textarea 
                    {...register("content")}
                    placeholder="Escribe el cuerpo de la noticia aquí..."
                    className="w-full bg-background border-2 border-border rounded-[2rem] p-6 min-h-[300px] outline-none focus:border-primary-500 transition-all font-mono text-sm leading-relaxed"
                  />
                  <div className="absolute right-4 bottom-4 p-2 glass rounded-xl opacity-40 group-focus-within:opacity-100 transition-opacity">
                     <Sparkles size={16} className="text-primary-500" />
                  </div>
                </div>
                {errors.content && <p className="text-xs text-red-500 ml-1 mt-0.5">{errors.content.message}</p>}
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl animate-in fade-in zoom-in-95 duration-300">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full py-4 text-lg" isLoading={isLoading} rightIcon={<Save size={20} />}>
                {isEditing ? "Guardar Cambios" : "Publicar Noticia Ahora"}
              </Button>
           </div>
        </form>

        {/* Sidebar / Preview */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass p-8 rounded-[2rem] border overflow-hidden">
             <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-6">Vista Previa</h4>
             {previewImage ? (
                <div className="w-full h-40 bg-foreground/5 rounded-2xl overflow-hidden mb-6 border">
                   <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
             ) : (
                <div className="w-full h-40 bg-foreground/5 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-foreground/20 mb-6 uppercase tracking-widest font-bold">
                   <ImageIcon size={32} className="mb-2" />
                   <span className="text-[10px]">Sin imagen</span>
                </div>
             )}
             <p className="text-sm font-bold opacity-30 uppercase tracking-widest mb-2">Ayuda</p>
             <p className="text-xs text-foreground/60 leading-relaxed mb-4 italic">
                Asegúrate de que la noticia sea clara y neutral. Las imágenes deben tener una resolución mínima de 1200x800px para una mejor visualización.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Shield, Save, Camera, Key } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api } from "@/services/apiService";

const profileSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function PerfilPage() {
  const { user, setAuth, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    setSuccess(false);
    try {
      // Assuming a patch profile endpoint
      const response = await api.patch("/auth/profile", data);
      if (user && token) {
        setAuth({ ...user, ...response.data }, token);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-title font-bold mb-2">Mi Perfil</h1>
        <p className="text-foreground/60">Gestiona tu información personal y seguridad de la cuenta.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Avatar Section */}
        <div className="col-span-1 flex flex-col items-center gap-6">
           <div className="relative group">
              <div className="w-40 h-40 bg-primary-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-primary-500/20 text-6xl font-bold uppercase overflow-hidden">
                {user?.name?.[0] || <User size={48} />}
              </div>
              <button className="absolute bottom-2 right-2 p-3 bg-white dark:bg-zinc-900 border border-border rounded-2xl shadow-xl text-primary-500 hover:scale-110 active:scale-95 transition-all">
                <Camera size={20} />
              </button>
           </div>
           <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                 <span className="font-bold text-lg">{user?.name}</span>
                 {user?.role === 'admin' && <Shield size={16} className="text-primary-500" />}
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-foreground/40">{user?.role}</p>
           </div>
        </div>

        {/* Form Section */}
        <div className="md:col-span-2 space-y-8">
           <div className="glass p-8 md:p-10 rounded-[2.5rem] border">
              <h3 className="font-title font-bold text-xl mb-8 flex items-center gap-3">
                 <User size={20} className="text-primary-500" />
                 Datos Personales
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                 <Input 
                   label="Nombre Completo" 
                   leftIcon={<User size={18} />} 
                   error={errors.name?.message}
                   {...register("name")}
                 />
                 <Input 
                   label="Correo Electrónico" 
                   type="email" 
                   leftIcon={<Mail size={18} />} 
                   error={errors.email?.message}
                   {...register("email")}
                 />

                 <div className="pt-4 flex items-center justify-between gap-6">
                    {success && <p className="text-sm font-bold text-green-500 animate-in fade-in slide-in-from-left-4">¡Perfil actualizado!</p>}
                    <Button type="submit" className="ml-auto px-10" isLoading={isLoading} rightIcon={<Save size={20} />}>
                       Guardar Cambios
                    </Button>
                 </div>
              </form>
           </div>

           {/* Security Section (Placeholder) */}
           <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-dashed border-border group hover:border-primary-500/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center text-foreground/40 group-hover:text-primary-500 transition-colors">
                       <Key size={24} />
                    </div>
                    <div>
                       <h4 className="font-bold">Seguridad</h4>
                       <p className="text-sm text-foreground/40">Cambiar contraseña y autenticación</p>
                    </div>
                 </div>
                 <Button variant="ghost" size="sm">Gestionar</Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

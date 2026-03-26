"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api } from "@/services/apiService";
import { useAuthStore } from "@/store/authStore";

const registerSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegistroPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      const { user, token } = response.data;
      setAuth(user, token);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Ocurrió un error durante el registro. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-10 pb-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-primary-500/5 -z-10 blur-3xl rounded-full" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-accent-500/5 -z-10 blur-3xl rounded-full" />

      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-title font-bold text-xl tracking-tight">
              Acción <span className="text-primary-500">Alvarado</span>
            </span>
          </Link>
          <h1 className="text-3xl font-title font-bold mb-2">Crear mi Cuenta</h1>
          <p className="text-foreground/60">
            Súmate para empezar a mejorar General Alvarado hoy.
          </p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[2.5rem] border shadow-2xl shadow-primary-500/5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Nombre Completo"
              placeholder="Ej: Juan Pérez"
              leftIcon={<User size={18} />}
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="tu@email.com"
              leftIcon={<Mail size={18} />}
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              placeholder="••••••••"
              leftIcon={<CheckCircle2 size={18} />}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-2xl animate-in fade-in zoom-in-95 duration-300">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-4 text-lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={20} />}
            >
              Completar Registro
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-foreground/60">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth/login"
                className="text-primary-500 font-bold hover:underline"
              >
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-foreground/40 leading-relaxed max-w-sm mx-auto">
          Al registrarte, aceptas nuestros Términos de Servicio y nuestra Política de Privacidad.
        </p>
      </div>
    </div>
  );
}

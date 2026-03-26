"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api } from "@/services/apiService";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", data);
      const { user, token } = response.data;
      setAuth(user, token);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Credenciales incorrectas. Verifica tu email y contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-10 pb-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-0 w-64 h-64 bg-primary-500/5 -z-10 blur-3xl rounded-full" />
      <div className="absolute bottom-20 right-0 w-64 h-64 bg-accent-500/5 -z-10 blur-3xl rounded-full" />

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-title font-bold text-xl tracking-tight">
              Acción <span className="text-primary-500">Alvarado</span>
            </span>
          </Link>
          <h1 className="text-3xl font-title font-bold mb-2">Bienvenido de Nuevo</h1>
          <p className="text-foreground/60">
            Ingresa para continuar participando en tu comunidad.
          </p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[2.5rem] border shadow-2xl shadow-primary-500/5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="tu@email.com"
              leftIcon={<Mail size={18} />}
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-foreground/70">
                  Contraseña
                </label>
                <Link
                  href="/auth/olvide-mi-password"
                  className="text-xs text-primary-500 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                error={errors.password?.message}
                {...register("password")}
                containerClassName="gap-0"
              />
            </div>

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
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-foreground/60">
              ¿No tienes una cuenta aún?{" "}
              <Link
                href="/auth/registro"
                className="text-primary-500 font-bold hover:underline"
              >
                Crea una cuenta gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

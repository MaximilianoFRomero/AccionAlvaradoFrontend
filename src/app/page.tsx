import Link from "next/link";
import { ArrowRight, MapPin, Newspaper, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6">
        {/* Background elements */}
        <div 
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/miramar01.jpg')" }}
        />
        <div className="absolute inset-0 -z-10 bg-white/45 backdrop-blur-[2px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />


        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-sm font-medium text-foreground/70 uppercase tracking-widest text-white">Comprometidos con el cambio</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-title font-bold leading-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Hacia un General Alvarado <br />
            <span className="gradient-text">Más Justo y Moderno</span>
          </h1>
          
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
            Únete a la agrupación vecinal que escucha a sus vecinos. Reporta problemas, mantente informado y participa en la construcción de nuestro futuro.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <Link href="/denuncias/nueva" className="btn-primary flex items-center gap-2 py-4 px-8 text-lg">
              Reportar Problema <ArrowRight size={20} />
            </Link>
            <Link href="/denuncias" className="flex items-center gap-2 font-bold px-8 py-4 hover:text-primary-500 transition-colors">
              Ver Mapa de Denuncias
            </Link>
          </div>
        </div>
      </section>

      {/* Features Summary */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Reportes Ciudadanos",
            desc: "Identifica y reporta problemas en tu barrio mediante nuestro mapa interactivo.",
            icon: MapPin,
            color: "bg-blue-500/10 text-blue-500"
          },
          {
            title: "Noticias Directas",
            desc: "Accede a información actualizada sobre nuestras propuestas y acciones locales.",
            icon: Newspaper,
            color: "bg-cyan-500/10 text-cyan-500"
          },
          {
            title: "Participación Activa",
            desc: "Súmate a nuestras reuniones y grupos de trabajo para mejorar Alvarado juntos.",
            icon: Users,
            color: "bg-indigo-500/10 text-indigo-500"
          }
        ].map((feat, i) => (
          <div key={i} className="glass p-8 rounded-2xl border border-border hover:shadow-xl transition-all duration-300 group">
            <div className={`w-14 h-14 rounded-xl ${feat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <feat.icon size={28} />
            </div>
            <h3 className="text-xl font-title font-bold mb-4">{feat.title}</h3>
            <p className="text-foreground/60 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto glass p-12 rounded-[2.5rem] text-center border overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 -z-10 blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <h2 className="text-3xl md:text-5xl font-title font-bold mb-6">¿Quieres ser parte del cambio?</h2>
          <p className="text-lg text-foreground/60 mb-10 max-w-xl mx-auto">
            Regístrate hoy mismo para empezar a reportar y seguir el estado de tus denuncias en tiempo real.
          </p>
          <Link href="/auth/registro" className="btn-primary py-4 px-10 text-lg">
            Crear mi Cuenta Gratis
          </Link>
        </div>
      </section>
    </div>
  );
}

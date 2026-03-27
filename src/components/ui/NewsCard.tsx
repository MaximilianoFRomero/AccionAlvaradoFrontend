import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  date: string;
  category?: string;
  featured?: boolean;
}

export const NewsCard = ({
  id,
  title,
  excerpt,
  imageUrl,
  date,
  category = "General",
  featured = false,
}: NewsCardProps) => {
  return (
    <Link 
      href={`/noticias/${id}`}
      className={cn(
        "group block glass overflow-hidden rounded-[2rem] border border-border hover:border-primary-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/5",
        featured ? "md:grid md:grid-cols-2 gap-0 items-stretch" : "h-full flex flex-col"
      )}
    >
      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden",
        featured ? "h-64 md:h-full" : "h-48"
      )}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-primary-500/10 flex items-center justify-center">
            <span className="text-primary-500/20 font-bold text-4xl">AA</span>
          </div>
        )}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-wider text-primary-500 border border-primary-500/20">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        "p-6 md:p-8 flex flex-col justify-center",
        featured ? "md:p-12" : "flex-grow"
      )}>
        <div className="flex items-center gap-2 text-foreground/40 text-xs font-medium mb-4">
          <Calendar size={14} />
          <span>{date}</span>
        </div>

        <h3 className={cn(
          "font-title font-bold leading-tight mb-4 group-hover:text-primary-500 transition-colors",
          featured ? "text-2xl md:text-4xl" : "text-xl"
        )}>
          {title}
        </h3>

        <p className={cn(
          "text-foreground/60 leading-relaxed mb-6 line-clamp-3",
          featured ? "text-lg" : "text-sm"
        )}>
          {excerpt}
        </p>

        <div className="flex items-center gap-2 text-primary-500 font-bold text-sm tracking-wide group/btn">
          Leer noticia completa
          <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-2" />
        </div>
      </div>
    </Link>
  );
};

export const NewsCardSkeleton = () => (
  <div className="glass rounded-[2rem] border border-border h-[400px] animate-pulse overflow-hidden">
    <div className="h-48 bg-foreground/5" />
    <div className="p-6 space-y-4">
      <div className="h-4 w-24 bg-foreground/5 rounded-full" />
      <div className="h-8 w-full bg-foreground/10 rounded-full" />
      <div className="h-4 w-full bg-foreground/5 rounded-full" />
      <div className="h-4 w-2/3 bg-foreground/5 rounded-full" />
    </div>
  </div>
);

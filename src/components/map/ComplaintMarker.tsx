"use client";

import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Clock, Tag, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ComplaintMarkerProps {
  complaint: {
    id: string;
    lat: number;
    lng: number;
    description: string;
    category: string;
    status: string;
    createdAt?: string;
  };
}

const getCategoryStyles = (category: string) => {
  switch (category) {
    case "calles": return { color: "text-red-500", bg: "bg-red-500", label: "Baches / Calles" };
    case "basura": return { color: "text-green-500", bg: "bg-green-500", label: "Basura" };
    case "luminarias": return { color: "text-yellow-500", bg: "bg-yellow-500", label: "Alumbrado" };
    default: return { color: "text-blue-500", bg: "bg-blue-500", label: "Seguridad" };
  }
};

export const ComplaintMarker = ({ complaint }: ComplaintMarkerProps) => {
  const style = getCategoryStyles(complaint.category);

  // Custom DivIcon for premium feel
  const customIcon = L.divIcon({
    className: "custom-div-icon",
    html: `
      <div class="relative w-8 h-8 ${style.bg} rounded-full border-4 border-white shadow-xl flex items-center justify-center transform hover:scale-125 transition-transform duration-300">
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <Marker position={[complaint.lat, complaint.lng]} icon={customIcon}>
      <Popup className="custom-popup">
        <div className="p-4 min-w-[240px]">
          <div className="flex items-center gap-2 mb-3">
            <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${style.bg} text-white`}>
              {style.label}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider bg-foreground/5 text-foreground/40 px-2 py-1 rounded-md">
              {complaint.status}
            </div>
          </div>

          <p className="text-sm font-medium line-clamp-3 mb-4 leading-relaxed text-foreground/80">
            "{complaint.description}"
          </p>

          <div className="flex flex-col gap-2 border-t border-border pt-3">
             <div className="flex items-center gap-2 text-[11px] text-foreground/50">
                <Clock size={12} />
                <span>Hace 2 días</span>
             </div>
             <div className="flex items-center gap-2 text-[11px] text-foreground/50">
                <MapPin size={12} />
                <span>Ubicación detectada</span>
             </div>
          </div>

          <Link 
            href={`/denuncias/${complaint.id}`}
            className="mt-4 w-full flex items-center justify-between text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors group"
          >
            Ver detalle completo
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Popup>
    </Marker>
  );
};

"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet + Next.js
if (typeof window !== "undefined") {
  const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  L.Marker.prototype.options.icon = DefaultIcon;
}

interface MapProps {
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode;
  onClick?: (e: L.LeafletMouseEvent) => void;
  selectedPosition?: [number, number] | null;
}

// Helper component to handle map clicks
const MapEvents = ({ onClick }: { onClick?: (e: L.LeafletMouseEvent) => void }) => {
  const map = useMap();
  useEffect(() => {
    if (!onClick) return;
    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
    };
  }, [map, onClick]);
  return null;
};

// Component to handle 2-finger gestures on mobile
const GestureHandler = () => {
  const map = useMap();
  
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    // Disable single finger dragging
    map.dragging.disable();

    const container = map.getContainer();
    const overlay = document.createElement("div");
    overlay.className = "absolute inset-0 z-[1000] bg-black/50 text-white flex items-center justify-center p-6 text-center font-bold text-sm pointer-events-none opacity-0 transition-opacity duration-300 backdrop-blur-[2px]";
    overlay.innerHTML = "<p>Usa dos dedos para mover el mapa</p>";
    container.appendChild(overlay);

    let timer: NodeJS.Timeout;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        overlay.style.opacity = "1";
        map.dragging.disable();
      } else {
        overlay.style.opacity = "0";
        map.dragging.enable();
      }
    };

    const handleTouchEnd = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        overlay.style.opacity = "0";
        map.dragging.disable();
      }, 800);
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchmove", (e) => {
      if (e.touches.length > 1) {
        overlay.style.opacity = "0";
      }
    });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      if (container.contains(overlay)) {
        container.removeChild(overlay);
      }
    };
  }, [map]);

  return null;
};

const MapComponent = ({
  center = [-38.2731, -57.8404], // Center of Miramar/Alvarado approx
  zoom = 14,
  children,
  onClick,
  selectedPosition,
}: MapProps) => {
  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false} // Disable scroll zoom to prevent hijacking desktop scroll too
        className="h-full w-full z-0"
        dragging={typeof window !== "undefined" && !(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onClick={onClick} />
        <GestureHandler />
        {selectedPosition && <Marker position={selectedPosition} />}
        {children}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

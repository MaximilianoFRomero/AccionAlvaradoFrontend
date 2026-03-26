"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet + Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

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

const MapComponent = ({
  center = [-38.2731, -57.8404], // Center of Miramar/Alvarado approx
  zoom = 14,
  children,
  onClick,
  selectedPosition,
}: MapProps) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onClick={onClick} />
      {selectedPosition && <Marker position={selectedPosition} />}
      {children}
    </MapContainer>
  );
};

export default MapComponent;

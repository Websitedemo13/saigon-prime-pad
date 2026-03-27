import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { properties } from "@/data/properties";
import "leaflet/dist/leaflet.css";

// Property coordinates in HCM
const propertyCoords: Record<string, [number, number]> = {
  "can-ho-cao-cap-vinhomes-central-park": [10.7942, 106.7214],
  "penthouse-landmark-81-skyview": [10.7952, 106.7220],
  "shophouse-the-sun-avenue": [10.7865, 106.7510],
  "biet-thu-vuon-ecopark-riverside": [10.8456, 106.8120],
  "can-ho-studio-masteri-an-phu": [10.8032, 106.7445],
  "dat-nen-khu-do-thi-sala": [10.7720, 106.7230],
  "van-phong-hang-a-bitexco": [10.7717, 106.7044],
  "nha-pho-lakeview-city": [10.7980, 106.7620],
  "can-ho-the-ascentia-phu-my-hung": [10.7295, 106.7185],
};

export default function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import("leaflet");

      // Fix default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        scrollWheelZoom: false,
      }).setView([10.7769, 106.7009], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Custom icon
      const goldIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width: 36px; height: 36px; 
          background: linear-gradient(135deg, #D4A853, #B8860B); 
          border: 3px solid white; 
          border-radius: 50%; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: bold; font-size: 14px;
        ">🏠</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
      });

      properties.forEach((p) => {
        const coords = propertyCoords[p.slug];
        if (!coords) return;

        const marker = L.marker(coords, { icon: goldIcon }).addTo(map);
        marker.bindPopup(`
          <div style="min-width: 220px; font-family: sans-serif;">
            <img src="${p.image}" style="width:100%; height:120px; object-fit:cover; border-radius:8px; margin-bottom:8px;" />
            <h3 style="margin:0 0 4px; font-size:14px; font-weight:700;">${p.title}</h3>
            <p style="margin:0 0 4px; color:#666; font-size:12px;">${p.location}</p>
            <p style="margin:0 0 8px; color:#D4A853; font-weight:700; font-size:16px;">${p.price}</p>
            <a href="/du-an/${p.slug}" style="
              display:inline-block; padding:6px 16px; 
              background: linear-gradient(135deg, #D4A853, #B8860B); 
              color:white; border-radius:6px; text-decoration:none; font-size:12px; font-weight:600;
            ">Xem chi tiết</a>
          </div>
        `);
      });

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <MapPin className="inline-block w-10 h-10 text-primary mr-3 -mt-1" />
            Bản Đồ Dự Án
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Khám phá vị trí đắc địa của các dự án BĐS cao cấp trên bản đồ TP.HCM
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-luxury border border-border">
          <div ref={mapRef} className="w-full h-[500px] md:h-[600px]" />
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {["Căn hộ", "Penthouse", "Biệt thự", "Shophouse", "Văn phòng", "Đất nền", "Nhà phố"].map((type) => (
            <div key={type} className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border border-border text-sm">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

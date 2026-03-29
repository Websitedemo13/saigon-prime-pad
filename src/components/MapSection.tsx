import { useEffect, useRef, useState, useMemo } from "react";
import { Navigation, Layers, Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import "leaflet/dist/leaflet.css";

const TYPE_COLORS: Record<string, string> = {
  "Căn hộ": "#D4A853",
  "Penthouse": "#E8B86D",
  "Biệt thự": "#2D5F2D",
  "Shophouse": "#C0392B",
  "Văn phòng": "#2980B9",
  "Đất nền": "#8E44AD",
  "Nhà phố": "#E67E22",
  "Studio": "#1ABC9C",
};

const PRICE_RANGES = [
  { label: "Tất cả", min: 0, max: Infinity },
  { label: "Dưới 3 tỷ", min: 0, max: 3 },
  { label: "3 - 5 tỷ", min: 3, max: 5 },
  { label: "5 - 10 tỷ", min: 5, max: 10 },
  { label: "10 - 20 tỷ", min: 10, max: 20 },
  { label: "Trên 20 tỷ", min: 20, max: Infinity },
];

function getColor(type: string) {
  for (const [key, color] of Object.entries(TYPE_COLORS)) {
    if (type.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return "#D4A853";
}

export default function MapSection() {
  const { data: properties = [] } = useProperties();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const propertiesWithCoords = useMemo(
    () => properties.filter((p) => p.latitude && p.longitude),
    [properties]
  );

  const allTypes = useMemo(
    () => [...new Set(propertiesWithCoords.map((p) => p.type).filter(Boolean))],
    [propertiesWithCoords]
  );

  const filteredProperties = useMemo(() => {
    const range = PRICE_RANGES[selectedPriceRange];
    return propertiesWithCoords.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.location.toLowerCase().includes(q) &&
          !p.district.toLowerCase().includes(q)
        )
          return false;
      }
      if (selectedTypes.size > 0) {
        if (!selectedTypes.has(p.type)) return false;
      }
      if (range && p.price_num) {
        if (p.price_num < range.min || p.price_num > range.max) return false;
      }
      return true;
    });
  }, [propertiesWithCoords, searchQuery, selectedTypes, selectedPriceRange]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTypes(new Set());
    setSelectedPriceRange(0);
  };

  const hasFilters = searchQuery || selectedTypes.size > 0 || selectedPriceRange > 0;

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || !propertiesWithCoords.length) return;

    if (mapInstanceRef.current) return; // already initialized

    const initMap = async () => {
      const L = await import("leaflet");

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        scrollWheelZoom: false,
        zoomControl: false,
      }).setView([10.7769, 106.7009], 12);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [propertiesWithCoords.length]);

  // Update markers when filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const updateMarkers = async () => {
      const L = await import("leaflet");

      // Remove old markers
      markersRef.current.forEach((m) => map.removeLayer(m));
      markersRef.current = [];

      filteredProperties.forEach((p) => {
        const color = getColor(p.type);
        const icon = L.divIcon({
          className: "custom-map-marker",
          html: `<div class="marker-pulse" style="--marker-color: ${color}">
            <div style="
              width: 40px; height: 40px;
              background: linear-gradient(135deg, ${color}, ${color}dd);
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 4px 15px ${color}66, 0 2px 8px rgba(0,0,0,0.2);
              display: flex; align-items: center; justify-content: center;
              font-size: 16px;
              transition: transform 0.3s ease;
            ">🏠</div>
          </div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -24],
        });

        const marker = L.marker([p.latitude!, p.longitude!], { icon }).addTo(map);
        markersRef.current.push(marker);

        marker.bindPopup(`
          <div style="min-width: 240px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif; padding: 4px;">
            ${p.image ? `<div style="position:relative; margin: -4px -4px 12px -4px; overflow:hidden; border-radius: 10px;">
              <img src="${p.image}" style="width:100%; height:140px; object-fit:cover; display:block;" />
              <div style="position:absolute; top:8px; left:8px; background: ${color}; color:white; padding: 3px 10px; border-radius: 20px; font-size:11px; font-weight:600;">${p.type}</div>
            </div>` : ''}
            <h3 style="margin:0 0 6px; font-size:15px; font-weight:700; color:#1a1a1a; line-height:1.3;">${p.title}</h3>
            <div style="display:flex; align-items:center; gap:4px; margin-bottom:8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span style="font-size:12px; color:#888;">${p.location}</span>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
              <span style="font-size:20px; font-weight:800; background: linear-gradient(135deg, ${color}, ${color}cc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${p.price}</span>
              ${p.roi ? `<span style="font-size:11px; background:#ecfdf5; color:#059669; padding:2px 8px; border-radius:12px; font-weight:600;">📈 ${p.roi}</span>` : ''}
            </div>
            <div style="display:flex; gap:6px; margin-bottom:12px;">
              ${p.area ? `<span style="font-size:11px; background:#f3f4f6; padding:3px 8px; border-radius:6px; color:#555;">📐 ${p.area}</span>` : ''}
              ${p.bedrooms ? `<span style="font-size:11px; background:#f3f4f6; padding:3px 8px; border-radius:6px; color:#555;">🛏 ${p.bedrooms} PN</span>` : ''}
              ${p.bathrooms ? `<span style="font-size:11px; background:#f3f4f6; padding:3px 8px; border-radius:6px; color:#555;">🚿 ${p.bathrooms} WC</span>` : ''}
            </div>
            <a href="/du-an/${p.slug}" style="
              display:block; text-align:center; padding:8px 16px;
              background: linear-gradient(135deg, ${color}, ${color}dd);
              color:white; border-radius:8px; text-decoration:none; font-size:13px; font-weight:600;
            ">Xem chi tiết →</a>
          </div>
        `, { maxWidth: 300, className: "custom-leaflet-popup" });
      });

      // Fit bounds
      if (markersRef.current.length > 1) {
        const group = L.featureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.15));
      } else if (markersRef.current.length === 1) {
        const ll = markersRef.current[0].getLatLng();
        map.setView(ll, 14);
      } else {
        map.setView([10.7769, 106.7009], 12);
      }
    };

    updateMarkers();
  }, [filteredProperties]);

  if (!propertiesWithCoords.length) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary/50 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Navigation className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Bản đồ tương tác</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Vị Trí Dự Án</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Khám phá vị trí đắc địa của {propertiesWithCoords.length} dự án BĐS cao cấp trên bản đồ TP.HCM
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, vị trí, quận..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/80 backdrop-blur-sm border-border/50 rounded-xl h-11"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 h-11 rounded-xl border text-sm font-medium transition-colors shrink-0 ${
                showFilters || hasFilters
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/80 backdrop-blur-sm border-border/50 text-foreground hover:bg-muted"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Bộ lọc</span>
              {hasFilters && (
                <span className="w-5 h-5 rounded-full bg-primary-foreground/20 text-[10px] flex items-center justify-center font-bold">
                  {(selectedTypes.size > 0 ? 1 : 0) + (selectedPriceRange > 0 ? 1 : 0)}
                </span>
              )}
              <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="bg-card/90 backdrop-blur-md rounded-2xl border border-border/50 p-4 space-y-4 shadow-lg animate-fade-in">
              {/* Type filter */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Loại BĐS</label>
                <div className="flex flex-wrap gap-2">
                  {allTypes.map((type) => {
                    const active = selectedTypes.has(type);
                    return (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                          active
                            ? "border-transparent text-white shadow-md"
                            : "border-border/50 text-foreground bg-background hover:bg-muted"
                        }`}
                        style={active ? { background: `linear-gradient(135deg, ${getColor(type)}, ${getColor(type)}cc)` } : {}}
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: getColor(type) }}
                        />
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price range filter */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Khoảng giá</label>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((range, i) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRange(i)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                        selectedPriceRange === i
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "border-border/50 text-foreground bg-background hover:bg-muted"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline font-medium flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Xóa tất cả bộ lọc
                </button>
              )}
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50">
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background/30 to-transparent z-10 pointer-events-none" />

          <div ref={mapRef} className="w-full h-[450px] sm:h-[500px] md:h-[600px]" />

          {/* Result count badge */}
          <div className="absolute top-4 left-4 z-20">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background/95 backdrop-blur-md shadow-lg border border-border/50">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">
                {filteredProperties.length}/{propertiesWithCoords.length} dự án
              </span>
            </div>
          </div>

          {/* No results message */}
          {filteredProperties.length === 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <div className="text-center p-6">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-lg font-semibold">Không tìm thấy dự án</p>
                <p className="text-muted-foreground text-sm mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <button onClick={clearFilters} className="text-primary font-medium hover:underline text-sm">
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {allTypes.map((type) => (
            <div
              key={type}
              onClick={() => toggleType(type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm shadow-sm cursor-pointer transition-all border ${
                selectedTypes.size === 0 || selectedTypes.has(type)
                  ? "bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-md"
                  : "bg-muted/30 border-transparent opacity-50"
              }`}
            >
              <div
                className="w-3.5 h-3.5 rounded-full shadow-sm"
                style={{ background: `linear-gradient(135deg, ${getColor(type)}, ${getColor(type)}cc)` }}
              />
              <span className="text-foreground font-medium">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom popup styles */}
      <style>{`
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          border-radius: 14px;
          padding: 0;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.1);
          border: 1px solid rgba(0,0,0,0.06);
        }
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 12px;
          line-height: 1.4;
        }
        .custom-leaflet-popup .leaflet-popup-tip {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .custom-map-marker {
          background: none !important;
          border: none !important;
        }
        .custom-map-marker:hover > div > div {
          transform: scale(1.2);
        }
        .marker-pulse {
          position: relative;
        }
        .marker-pulse::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          width: 50px; height: 50px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: var(--marker-color);
          opacity: 0;
          animation: pulse-ring 2s ease-out infinite;
        }
        @keyframes pulse-ring {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.4; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Bed, Bath, Square, TrendingUp, ArrowRight, SlidersHorizontal, LayoutGrid, List, Building2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { propertyTypes, districts, priceRanges } from "@/data/properties";
import { useProperties } from "@/hooks/useProperties";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

type ViewMode = "grid" | "list";
type SortOption = "default" | "price-asc" | "price-desc" | "area-asc" | "area-desc";

export default function AllProjects() {
  const { data: properties = [], isLoading } = useProperties();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("Tất cả");
  const [selectedDistrict, setSelectedDistrict] = useState("Tất cả");
  const [selectedPrice, setSelectedPrice] = useState("Tất cả");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filtered = useMemo(() => {
    let result = [...properties];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.developer.toLowerCase().includes(q)
      );
    }

    if (selectedType !== "Tất cả") {
      result = result.filter(p => p.type === selectedType);
    }

    if (selectedDistrict !== "Tất cả") {
      result = result.filter(p => p.district === selectedDistrict);
    }

    const range = priceRanges.find(r => r.label === selectedPrice);
    if (range && selectedPrice !== "Tất cả") {
      result = result.filter(p => p.price_num >= range.min && p.price_num < range.max);
    }

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price_num - b.price_num); break;
      case "price-desc": result.sort((a, b) => b.price_num - a.price_num); break;
      case "area-asc": result.sort((a, b) => a.area_num - b.area_num); break;
      case "area-desc": result.sort((a, b) => b.area_num - a.area_num); break;
    }

    return result;
  }, [properties, search, selectedType, selectedDistrict, selectedPrice, sortBy]);

  const activeFilters = [selectedType, selectedDistrict, selectedPrice].filter(f => f !== "Tất cả");

  const clearFilters = () => {
    setSearch("");
    setSelectedType("Tất cả");
    setSelectedDistrict("Tất cả");
    setSelectedPrice("Tất cả");
    setSortBy("default");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-28 pb-16 bg-gradient-to-br from-secondary via-secondary/95 to-primary/20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-primary rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Tất Cả <span className="text-gradient">Dự Án</span>
            </h1>
            <p className="text-lg text-white/70 mb-8">
              Khám phá {properties.length} dự án bất động sản cao cấp tại các vị trí đắc địa nhất TP. Hồ Chí Minh
            </p>

            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên dự án, khu vực, chủ đầu tư..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-12 h-14 bg-white/95 border-0 text-base rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-2xl shadow-card p-6 mb-8 animate-fade-in">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <span className="font-semibold text-lg">Bộ lọc</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Loại BĐS" /></SelectTrigger>
                <SelectContent>{propertyTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Khu vực" /></SelectTrigger>
                <SelectContent>{districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Khoảng giá" /></SelectTrigger>
                <SelectContent>{priceRanges.map(r => <SelectItem key={r.label} value={r.label}>{r.label}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Sắp xếp" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Mặc định</SelectItem>
                  <SelectItem value="price-asc">Giá: Thấp → Cao</SelectItem>
                  <SelectItem value="price-desc">Giá: Cao → Thấp</SelectItem>
                  <SelectItem value="area-asc">DT: Nhỏ → Lớn</SelectItem>
                  <SelectItem value="area-desc">DT: Lớn → Nhỏ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">Đang lọc:</span>
                {activeFilters.map(f => <Badge key={f} variant="secondary" className="gap-1">{f}</Badge>)}
                <button onClick={clearFilters} className="text-sm text-destructive hover:underline flex items-center gap-1">
                  <X className="w-3 h-3" /> Xoá bộ lọc
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Tìm thấy <span className="font-bold text-foreground">{filtered.length}</span> dự án
            </p>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Không tìm thấy dự án</h3>
              <p className="text-muted-foreground mb-6">Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm</p>
              <Button onClick={clearFilters} variant="outline">Xoá bộ lọc</Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <Card key={p.id} className="card-hover border-0 shadow-card overflow-hidden group animate-scale-in" style={{ animationDelay: `${i * 0.08}s` }}>
                  <Link to={`/du-an/${p.slug}`} className="block">
                    <div className="relative overflow-hidden">
                      <img src={p.image || "/placeholder.svg"} alt={p.title} className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-3 left-3"><Badge className="bg-gradient-primary text-primary-foreground text-xs shadow-lg">{p.status}</Badge></div>
                      <div className="absolute top-3 right-3"><Badge variant="secondary" className="bg-white/90 text-foreground font-bold text-xs shadow-lg"><TrendingUp className="w-3 h-3 mr-1" />{p.roi}</Badge></div>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                        <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg"><ArrowRight className="w-4 h-4" /></div>
                      </div>
                    </div>
                  </Link>
                  <CardContent className="p-5">
                    <Badge variant="outline" className="text-primary border-primary text-xs mb-2">{p.type}</Badge>
                    <Link to={`/du-an/${p.slug}`}><h3 className="font-bold text-lg mb-1 line-clamp-2 hover:text-primary transition-colors">{p.title}</h3></Link>
                    <div className="flex items-center text-muted-foreground text-sm mb-3"><MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />{p.location}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {p.area_num > 0 && <span className="flex items-center gap-1"><Square className="w-3.5 h-3.5 text-primary" />{p.area}</span>}
                      {p.bedrooms > 0 && <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-primary" />{p.bedrooms} PN</span>}
                      {p.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-primary" />{p.bathrooms} WC</span>}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xl font-bold text-primary">{p.price}</div>
                        <div className="text-xs text-muted-foreground">{p.price_per_m2}</div>
                      </div>
                      <Button size="sm" className="btn-primary text-xs" asChild><Link to={`/du-an/${p.slug}`}>Chi tiết</Link></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((p, i) => (
                <Link key={p.id} to={`/du-an/${p.slug}`} className="block group animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <Card className="card-hover border-0 shadow-card overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-72 h-48 sm:h-auto overflow-hidden shrink-0 relative">
                        <img src={p.image || "/placeholder.svg"} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                        <div className="absolute top-3 left-3"><Badge className="bg-gradient-primary text-primary-foreground text-xs shadow-lg">{p.status}</Badge></div>
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-primary border-primary text-xs">{p.type}</Badge>
                            <Badge variant="secondary" className="text-xs font-bold"><TrendingUp className="w-3 h-3 mr-1" />{p.roi}</Badge>
                          </div>
                          <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{p.title}</h3>
                          <div className="flex items-center text-muted-foreground text-sm mb-3"><MapPin className="w-4 h-4 mr-1" />{p.location}</div>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{p.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {p.features.map((f, idx) => <Badge key={idx} variant="secondary" className="text-xs">{f}</Badge>)}
                          </div>
                        </div>
                        <div className="flex items-end justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            {p.area_num > 0 && <span className="flex items-center gap-1"><Square className="w-4 h-4 text-primary" />{p.area}</span>}
                            {p.bedrooms > 0 && <span className="flex items-center gap-1"><Bed className="w-4 h-4 text-primary" />{p.bedrooms} PN</span>}
                            {p.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-4 h-4 text-primary" />{p.bathrooms} WC</span>}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{p.price}</div>
                            <div className="text-xs text-muted-foreground">{p.price_per_m2}</div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}

import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Bed, Bath, Square, TrendingUp, Building2, Calendar, Car, Phone, Mail, CheckCircle2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePropertyBySlug, useProperties } from "@/hooks/useProperties";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: property, isLoading } = usePropertyBySlug(slug || "");
  const { data: allProperties } = useProperties();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Không tìm thấy dự án</h1>
          <Button asChild className="btn-primary">
            <Link to="/">Về trang chủ</Link>
          </Button>
        </div>
      </div>
    );
  }

  const otherProperties = allProperties?.filter(p => p.id !== property.id) || [];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Banner */}
      <section className="relative h-[60vh] min-h-[400px]">
        <img
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <Badge className="bg-gradient-primary text-primary-foreground text-sm px-4 py-1">
                {property.status}
              </Badge>
              <Badge variant="secondary" className="bg-white/90 text-foreground font-bold">
                <TrendingUp className="w-3 h-3 mr-1" />
                ROI {property.roi}
              </Badge>
              <Badge variant="outline" className="text-white border-white/50">
                {property.type}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
              {property.title}
            </h1>
            <div className="flex items-center text-white/80 text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              {property.location}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Price & Specs */}
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-end justify-between mb-6">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Giá bán</p>
                      <div className="text-4xl font-bold text-primary">{property.price}</div>
                      <p className="text-muted-foreground">{property.price_per_m2}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { icon: Square, label: "Diện tích", value: property.area },
                      { icon: Bed, label: "Phòng ngủ", value: `${property.bedrooms} PN` },
                      { icon: Bath, label: "Phòng tắm", value: `${property.bathrooms} WC` },
                      { icon: Building2, label: "Số tầng", value: `${property.floors} tầng` },
                    ].map((item, i) => (
                      <div key={i} className="bg-muted/50 rounded-xl p-4 text-center">
                        <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="font-bold text-lg">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Mô Tả Chi Tiết</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {property.description}
                  </p>
                </CardContent>
              </Card>

              {/* Features */}
              {property.features.length > 0 && (
                <Card className="border-0 shadow-card">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Đặc Điểm Nổi Bật</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {property.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                          <span className="font-medium">{f}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <Card className="border-0 shadow-card">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Tiện Ích</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((a, i) => (
                        <div key={i} className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          {a}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Gallery */}
              {property.gallery.length > 0 && (
                <Card className="border-0 shadow-card">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Hình Ảnh Dự Án</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {property.gallery.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${property.title} - ${i + 1}`}
                          className="rounded-xl w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-0 shadow-card sticky top-24">
                <CardContent className="p-6 space-y-5">
                  <h3 className="text-xl font-bold">Thông Tin Dự Án</h3>
                  <Separator />
                  <div className="space-y-4 text-sm">
                    {[
                      { label: "Chủ đầu tư", value: property.developer },
                      { label: "Năm bàn giao", value: property.year_built },
                      { label: "Bãi đỗ xe", value: property.parking },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-semibold text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {property.nearby_places.length > 0 && (
                    <>
                      <Separator />
                      <h4 className="font-bold">Vị trí lân cận</h4>
                      <div className="space-y-2">
                        {property.nearby_places.map((place, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Navigation className="w-3.5 h-3.5 text-primary shrink-0" />
                            {place}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <Separator />
                  <div className="space-y-3">
                    <Button className="btn-primary w-full" asChild>
                      <a href="tel:0123456789">
                        <Phone className="w-4 h-4 mr-2" /> Gọi tư vấn ngay
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="mailto:info@vsm-realestate.com">
                        <Mail className="w-4 h-4 mr-2" /> Gửi email
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Properties */}
          {otherProperties.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Dự Án Liên Quan</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {otherProperties.slice(0, 4).map((p) => (
                  <Link key={p.id} to={`/du-an/${p.slug}`} className="group">
                    <Card className="card-hover border-0 shadow-card overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 h-40 sm:h-auto overflow-hidden shrink-0">
                          <img
                            src={p.image || "/placeholder.svg"}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                        <CardContent className="p-5 flex flex-col justify-center">
                          <Badge className="w-fit mb-2 bg-gradient-primary text-primary-foreground text-xs">
                            {p.type}
                          </Badge>
                          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                            {p.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">{p.location}</p>
                          <p className="text-xl font-bold text-primary">{p.price}</p>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}

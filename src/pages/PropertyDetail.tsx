import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, MapPin, Bed, Bath, Square, TrendingUp, Building2, Calendar, Car,
  Phone, Mail, CheckCircle2, Navigation, ChevronLeft, ChevronRight, X, Share2,
  Heart, Maximize2, Shield, Star, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePropertyBySlug, useProperties } from "@/hooks/useProperties";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollReveal, { StaggerContainer, staggerItem } from "@/components/ScrollReveal";
import PropertyDetailSections from "@/components/PropertyDetailSections";
import { motion, AnimatePresence } from "framer-motion";

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: property, isLoading } = usePropertyBySlug(slug || "");
  const { data: allProperties } = useProperties();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-muted-foreground animate-pulse">Đang tải dự án...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Building2 className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Không tìm thấy dự án</h1>
          <p className="text-muted-foreground">Dự án này có thể đã bị xóa hoặc không tồn tại.</p>
          <Button asChild className="btn-primary">
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" />Về trang chủ</Link>
          </Button>
        </div>
      </div>
    );
  }

  const allImages = [property.image, ...property.gallery].filter(Boolean);
  const otherProperties = allProperties?.filter((p) => p.id !== property.id) || [];

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const openMainLightbox = (index: number) => {
    openLightbox(allImages, index);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner with Parallax Feel */}
      <section className="relative h-[65vh] min-h-[450px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/40 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute bottom-0 left-0 right-0 p-6 md:p-10"
        >
          <div className="container mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors text-sm backdrop-blur-sm bg-white/10 rounded-full px-4 py-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
            </Link>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="bg-gradient-primary text-primary-foreground text-sm px-4 py-1.5 shadow-lg">
                {property.status}
              </Badge>
              <Badge className="bg-white/90 text-foreground font-bold shadow-lg">
                <TrendingUp className="w-3.5 h-3.5 mr-1 text-green-600" />
                ROI {property.roi}
              </Badge>
              <Badge variant="outline" className="text-white border-white/40 backdrop-blur-sm">
                {property.type}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 max-w-4xl leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center text-white/80 text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              {property.location}
            </div>
          </div>
        </motion.div>

        {/* Gallery Thumbnails Overlay */}
        {allImages.length > 1 && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute bottom-6 right-6 hidden lg:flex gap-2"
          >
            {allImages.slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => openLightbox(i)}
                className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-white/50 hover:border-white transition-all hover:scale-105 shadow-lg"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                {i === 3 && allImages.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold">
                    +{allImages.length - 4}
                  </div>
                )}
              </button>
            ))}
            <button
              onClick={() => openLightbox(0)}
              className="w-20 h-20 rounded-lg bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30 transition-all flex flex-col items-center justify-center text-white"
            >
              <Maximize2 className="w-5 h-5 mb-1" />
              <span className="text-xs">Xem tất cả</span>
            </button>
          </motion.div>
        )}
      </section>

      {/* Quick Stats Bar */}
      <ScrollReveal>
        <div className="bg-card border-b border-border shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6">
                {[
                  { icon: Square, value: property.area, label: "Diện tích" },
                  { icon: Bed, value: `${property.bedrooms} PN`, label: "Phòng ngủ" },
                  { icon: Bath, value: `${property.bathrooms} WC`, label: "Phòng tắm" },
                  { icon: Building2, value: `${property.floors} tầng`, label: "Số tầng" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <item.icon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-bold text-sm">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{property.price}</div>
                <div className="text-sm text-muted-foreground">{property.price_per_m2}</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Content */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <ScrollReveal>
                <Card className="border-0 shadow-card overflow-hidden">
                  <div className="h-1 bg-gradient-primary" />
                  <CardContent className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-primary" />
                      Mô Tả Chi Tiết
                    </h2>
                    <div
                      className="text-muted-foreground leading-relaxed text-lg prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: property.description }}
                    />
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Features */}
              {property.features.length > 0 && (
                <ScrollReveal delay={0.1}>
                  <Card className="border-0 shadow-card overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                    <CardContent className="p-6 md:p-8">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Star className="w-6 h-6 text-primary" />
                        Đặc Điểm Nổi Bật
                      </h2>
                      <StaggerContainer className="grid sm:grid-cols-2 gap-3">
                        {property.features.map((f, i) => (
                          <motion.div
                            key={i}
                            variants={staggerItem}
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium">{f}</span>
                          </motion.div>
                        ))}
                      </StaggerContainer>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )}

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <ScrollReveal delay={0.15}>
                  <Card className="border-0 shadow-card overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                    <CardContent className="p-6 md:p-8">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-primary" />
                        Tiện Ích Đẳng Cấp
                      </h2>
                      <StaggerContainer className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {property.amenities.map((a, i) => (
                          <motion.div
                            key={i}
                            variants={staggerItem}
                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="w-2.5 h-2.5 rounded-full bg-gradient-primary shrink-0" />
                            <span className="text-sm font-medium">{a}</span>
                          </motion.div>
                        ))}
                      </StaggerContainer>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )}

              {/* Gallery */}
              {property.gallery.length > 0 && (
                <ScrollReveal delay={0.2}>
                  <Card className="border-0 shadow-card overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                    <CardContent className="p-6 md:p-8">
                      <h2 className="text-2xl font-bold mb-6">🏠 Hình Ảnh Dự Án</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {property.gallery.map((img, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => openLightbox(i + 1)}
                            className="relative group rounded-xl overflow-hidden aspect-[4/3]"
                          >
                            <img
                              src={img}
                              alt={`${property.title} - ${i + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                              <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ScrollReveal direction="right">
                <Card className="border-0 shadow-card sticky top-24 overflow-hidden">
                  <div className="h-1 bg-gradient-primary" />
                  <CardContent className="p-6 space-y-5">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      Thông Tin Dự Án
                    </h3>
                    <Separator />
                    <div className="space-y-4 text-sm">
                      {[
                        { icon: Building2, label: "Chủ đầu tư", value: property.developer },
                        { icon: Calendar, label: "Năm bàn giao", value: property.year_built },
                        { icon: Car, label: "Bãi đỗ xe", value: property.parking },
                        { icon: Square, label: "Diện tích", value: property.area },
                        { icon: TrendingUp, label: "ROI", value: property.roi },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <item.icon className="w-4 h-4 text-primary" />
                            {item.label}
                          </span>
                          <span className="font-semibold text-right max-w-[55%]">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {property.nearby_places.length > 0 && (
                      <>
                        <Separator />
                        <h4 className="font-bold flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-primary" />
                          Vị trí lân cận
                        </h4>
                        <div className="space-y-2">
                          {property.nearby_places.map((place, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground p-1.5 rounded hover:bg-muted/50 transition-colors">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              {place}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <Separator />
                    <div className="space-y-3">
                      <Button className="btn-primary w-full h-12 text-base font-semibold" asChild>
                        <a href="tel:0123456789">
                          <Phone className="w-5 h-5 mr-2" /> Gọi tư vấn ngay
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full h-11" asChild>
                        <a href="mailto:info@vsm-realestate.com">
                          <Mail className="w-4 h-4 mr-2" /> Gửi email
                        </a>
                      </Button>
                      <Button variant="ghost" className="w-full h-10 text-muted-foreground" asChild>
                        <Link to="/#contact">
                          <Heart className="w-4 h-4 mr-2" /> Đăng ký tư vấn miễn phí
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>

          {/* Related Properties */}
          {otherProperties.length > 0 && (
            <ScrollReveal>
              <div className="mt-16">
                <h2 className="text-3xl font-bold mb-2">Dự Án Liên Quan</h2>
                <p className="text-muted-foreground mb-8">Khám phá thêm cơ hội đầu tư hấp dẫn</p>
                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
                  {otherProperties.slice(0, 3).map((p) => (
                    <motion.div key={p.id} variants={staggerItem}>
                      <Link to={`/du-an/${p.slug}`} className="group block">
                        <Card className="card-hover border-0 shadow-card overflow-hidden h-full">
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={p.image || "/placeholder.svg"}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Badge className="absolute top-3 left-3 bg-gradient-primary text-primary-foreground shadow-lg">
                              {p.type}
                            </Badge>
                            <Badge className="absolute top-3 right-3 bg-white/90 text-foreground font-bold shadow-lg">
                              <TrendingUp className="w-3 h-3 mr-1" />{p.roi}
                            </Badge>
                          </div>
                          <CardContent className="p-5">
                            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                              {p.title}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                              <MapPin className="w-3.5 h-3.5" />{p.location}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-primary">{p.price}</span>
                              <span className="text-xs text-muted-foreground">{p.area}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </StaggerContainer>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && allImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
              }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={allImages[lightboxIndex]}
              alt=""
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev + 1) % allImages.length);
              }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <BackToTop />
    </div>
  );
}

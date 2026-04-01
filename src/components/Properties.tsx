import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Square, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProperties } from "@/hooks/useProperties";
import { useSiteContent } from "@/hooks/useSiteContent";
import ScrollReveal, { StaggerContainer, staggerItem } from "@/components/ScrollReveal";
import { motion } from "framer-motion";

export default function Properties() {
  const { data: properties, isLoading } = useProperties();
  const { data: sectionContent } = useSiteContent("properties_section");
  const section = sectionContent?.content as Record<string, any> | null;

  const title = section?.title || "Bất Động Sản Nổi Bật";
  const subtitle = section?.subtitle || "Khám phá những cơ hội đầu tư hấp dẫn với mức sinh lời cao tại các vị trí đắc địa nhất Hồ Chí Minh";

  if (isLoading) {
    return (
      <section id="properties" className="py-20 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        </div>
      </section>
    );
  }

  if (!properties?.length) return null;

  return (
    <section id="properties" className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" staggerDelay={0.15}>
          {properties.map((property) => (
            <motion.div key={property.id} variants={staggerItem}>
              <Card className="card-hover border-0 bg-gradient-card shadow-card overflow-hidden group h-full">
                <Link to={`/du-an/${property.slug}`} className="block">
                  <div className="relative overflow-hidden">
                    <img 
                      src={property.image || "/placeholder.svg"} 
                      alt={property.title}
                      className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-primary text-primary-foreground shadow-lg">{property.status}</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-foreground font-bold shadow-lg">
                        <TrendingUp className="w-3 h-3 mr-1" />{property.roi}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>

                <CardContent className="p-6">
                  <div className="mb-3">
                    <Badge variant="outline" className="text-primary border-primary">{property.type}</Badge>
                  </div>
                  <Link to={`/du-an/${property.slug}`}>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">{property.title}</h3>
                  </Link>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 mr-1 shrink-0" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1"><Square className="w-4 h-4 text-primary" /><span>{property.area}</span></div>
                    <div className="flex items-center gap-1"><Bed className="w-4 h-4 text-primary" /><span>{property.bedrooms} PN</span></div>
                    <div className="flex items-center gap-1"><Bath className="w-4 h-4 text-primary" /><span>{property.bathrooms} WC</span></div>
                  </div>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-primary mb-1">{property.price}</div>
                    <div className="text-sm text-muted-foreground">{property.price_per_m2}</div>
                  </div>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {property.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" asChild><Link to={`/du-an/${property.slug}`}>Xem chi tiết</Link></Button>
                    <Button className="btn-primary" size="sm" asChild><a href="#contact">Liên hệ</a></Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </StaggerContainer>

        <ScrollReveal>
          <div className="text-center">
            <Button className="btn-secondary text-lg px-8 py-4" asChild>
              <Link to="/du-an">Xem Tất Cả Dự Án</Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

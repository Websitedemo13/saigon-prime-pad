import { MapPin, Bed, Bath, Square, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import luxuryApartment from "@/assets/luxury-apartment.jpg";

const properties = [
  {
    id: 1,
    title: "Căn hộ cao cấp Vinhomes Central Park",
    location: "Quận Bình Thạnh, TP.HCM",
    price: "5.2 tỷ",
    pricePerM2: "85 triệu/m²",
    area: "75m²",
    bedrooms: 2,
    bathrooms: 2,
    type: "Căn hộ",
    status: "Sẵn sàng bàn giao",
    roi: "+12%/năm",
    image: luxuryApartment,
    features: ["View sông", "Nội thất cao cấp", "Bể bơi vô cực"]
  },
  {
    id: 2,
    title: "Penthouse Landmark 81 Skyview",
    location: "Quận Bình Thạnh, TP.HCM", 
    price: "25.8 tỷ",
    pricePerM2: "180 triệu/m²",
    area: "145m²",
    bedrooms: 3,
    bathrooms: 3,
    type: "Penthouse",
    status: "Độc quyền",
    roi: "+15%/năm",
    image: luxuryApartment,
    features: ["Tầng cao nhất", "Sân vườn riêng", "View 360°"]
  },
  {
    id: 3,
    title: "Shophouse The Sun Avenue",
    location: "Quận 2, TP.HCM",
    price: "12.5 tỷ",
    pricePerM2: "120 triệu/m²",
    area: "105m²",
    bedrooms: 4,
    bathrooms: 3,
    type: "Shophouse",
    status: "Kinh doanh tốt",
    roi: "+18%/năm",
    image: luxuryApartment,
    features: ["Mặt tiền đường", "Kinh doanh sẵn", "Vị trí đắc địa"]
  }
];

export default function Properties() {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Bất Động Sản Nổi Bật
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Khám phá những cơ hội đầu tư hấp dẫn với mức sinh lời cao tại 
            các vị trí đắc địa nhất Hồ Chí Minh
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.map((property, index) => (
            <Card 
              key={property.id} 
              className="card-hover border-0 bg-gradient-card shadow-card overflow-hidden animate-scale-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-primary text-primary-foreground">
                    {property.status}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-foreground font-bold">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {property.roi}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-3">
                  <Badge variant="outline" className="text-primary border-primary">
                    {property.type}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                  {property.title}
                </h3>

                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Square className="w-4 h-4 text-primary" />
                    <span>{property.area}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4 text-primary" />
                    <span>{property.bedrooms} PN</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4 text-primary" />
                    <span>{property.bathrooms} WC</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {property.price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {property.pricePerM2}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {property.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    Xem chi tiết
                  </Button>
                  <Button className="btn-primary" size="sm">
                    Liên hệ
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in">
          <Button className="btn-secondary text-lg px-8 py-4">
            Xem Tất Cả Dự Án
          </Button>
        </div>
      </div>
    </section>
  );
}
import { useState } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import heroImage from "@/assets/hero-hcm.jpg";

const districts = [
  "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", 
  "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12", "Bình Thạnh", 
  "Gò Vấp", "Phú Nhuận", "Tân Bình", "Tân Phú", "Thủ Đức"
];

const propertyTypes = [
  "Căn hộ chung cư", "Nhà riêng", "Biệt thự", "Đất nền", "Shophouse", "Văn phòng"
];

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedType, setSelectedType] = useState("");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 via-secondary/70 to-primary/80" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/10 rounded-full animate-float" style={{ animationDelay: "1s" }} />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Bất Động Sản
            <span className="text-gradient block">Hồ Chí Minh</span>
            Cao Cấp
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
            Khám phá những cơ hội đầu tư hấp dẫn nhất tại trung tâm kinh tế Việt Nam. 
            <br />VSM Real Estate - Đối tác tin cậy của bạn.
          </p>

          {/* Search Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-luxury animate-scale-in" style={{ animationDelay: "0.3s" }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Input
                  placeholder="Tìm kiếm theo khu vực..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/90 border-0 h-12 text-foreground placeholder:text-muted-foreground"
                />
                <Search className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
              </div>
              
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="bg-white/90 border-0 h-12">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-white/90 border-0 h-12">
                  <SelectValue placeholder="Loại bất động sản" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button className="btn-primary h-12 text-lg font-semibold">
                <Search className="w-5 h-5 mr-2" />
                Tìm Kiếm
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-slide-in-right" style={{ animationDelay: "0.6s" }}>
            <Button className="btn-primary text-lg px-8 py-4">
              Tư Vấn Miễn Phí
            </Button>
            <Button className="btn-outline text-lg px-8 py-4 text-white border-white hover:text-primary">
              Xem Dự Án
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/70" />
      </div>
    </section>
  );
}
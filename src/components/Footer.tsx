import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  services: [
    "Mua bán bất động sản",
    "Tư vấn đầu tư",
    "Định giá tài sản",
    "Hỗ trợ pháp lý",
    "Quản lý tài sản"
  ],
  areas: [
    "Quận 1", "Quận 2", "Quận 7", "Quận 9",
    "Bình Thạnh", "Thủ Đức", "Gò Vấp"
  ],
  legal: [
    "Chính sách bảo mật",
    "Điều khoản sử dụng", 
    "Quy định giao dịch",
    "Giải quyết khiếu nại"
  ]
};

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-primary-light mb-4">
                VSM Real Estate
              </h3>
              <p className="text-secondary-foreground/80 leading-relaxed">
                Đối tác tin cậy trong lĩnh vực bất động sản Hồ Chí Minh với 
                hơn 15 năm kinh nghiệm và cam kết mang đến giá trị tốt nhất 
                cho khách hàng.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-light" />
                <span className="text-lg font-semibold">0123.456.789</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-light" />
                <span>info@vsm-realestate.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-light" />
                <span>123 Nguyễn Huệ, Q.1, TP.HCM</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-primary-light">
              Dịch Vụ
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((service) => (
                <li key={service}>
                  <a 
                    href="#" 
                    className="text-secondary-foreground/80 hover:text-primary-light transition-colors duration-200"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-primary-light">
              Khu Vực
            </h4>
            <ul className="space-y-3">
              {footerLinks.areas.map((area) => (
                <li key={area}>
                  <a 
                    href="#" 
                    className="text-secondary-foreground/80 hover:text-primary-light transition-colors duration-200"
                  >
                    BĐS {area}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-primary-light">
              Kết Nối
            </h4>
            
            <div className="flex gap-3 mb-6">
              <Button size="icon" variant="outline" className="border-primary-light text-primary-light hover:bg-primary-light hover:text-secondary">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline" className="border-primary-light text-primary-light hover:bg-primary-light hover:text-secondary">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline" className="border-primary-light text-primary-light hover:bg-primary-light hover:text-secondary">
                <Youtube className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline" className="border-primary-light text-primary-light hover:bg-primary-light hover:text-secondary">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>

            <ul className="space-y-3">
              {footerLinks.legal.map((legal) => (
                <li key={legal}>
                  <a 
                    href="#" 
                    className="text-secondary-foreground/80 hover:text-primary-light transition-colors duration-200 text-sm"
                  >
                    {legal}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-secondary-foreground/60">
              © 2024 VSM Real Estate. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm text-secondary-foreground/60">
              <span>Giấy phép kinh doanh: 0123456789</span>
              <span>|</span>
              <span>Cập nhật: {new Date().toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";

const defaultServices = ["Mua bán bất động sản", "Tư vấn đầu tư", "Định giá tài sản", "Hỗ trợ pháp lý", "Quản lý tài sản"];
const defaultAreas = ["Quận 1", "Quận 2", "Quận 7", "Quận 9", "Bình Thạnh", "Thủ Đức", "Gò Vấp"];
const defaultLegalLinks = [
  { label: "Chính sách bảo mật", url: "#contact" },
  { label: "Điều khoản sử dụng", url: "#about" },
  { label: "Quy định giao dịch", url: "#properties" },
  { label: "Giải quyết khiếu nại", url: "#contact" },
];

const socialIcons: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  tiktok: Globe,
  zalo: Phone,
};

export default function Footer() {
  const { data: footerContent } = useSiteContent("footer");
  const { data: contactContent } = useSiteContent("contact");
  const footer = footerContent?.content as Record<string, any> | null;
  const contact = contactContent?.content as Record<string, any> | null;

  const companyName = footer?.companyName || "VSM Real Estate";
  const description = footer?.description || "Đối tác tin cậy trong lĩnh vực bất động sản Hồ Chí Minh với hơn 15 năm kinh nghiệm.";
  const copyright = footer?.copyright || "© 2024 VSM Real Estate. All rights reserved.";
  const businessLicense = footer?.businessLicense || "0123456789";
  const phone = contact?.phone || "0123.456.789";
  const email = contact?.email || "info@vsm-realestate.com";
  const address = contact?.address || "123 Nguyễn Huệ, Q.1, TP.HCM";

  const services: string[] = footer?.services?.length ? footer.services : defaultServices;
  const areas: string[] = footer?.areas?.length ? footer.areas : defaultAreas;
  const legalLinks: { label: string; url: string }[] = footer?.legalLinks?.length
    ? footer.legalLinks.map((l: any) => (typeof l === "string" ? { label: l, url: "#" } : l))
    : defaultLegalLinks;

  const social = footer?.social || {};
  const activeSocials = Object.entries(social).filter(([, url]) => url);

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-primary-light mb-4">{companyName}</h3>
              {description.startsWith("<") ? (
                <div className="text-secondary-foreground/80 leading-relaxed prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: description }} />
              ) : (
                <p className="text-secondary-foreground/80 leading-relaxed">{description}</p>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary-light" /><span className="text-lg font-semibold">{phone}</span></div>
              <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary-light" /><span>{email}</span></div>
              <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary-light" /><span>{address}</span></div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-primary-light">Dịch Vụ</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}><a href="#" className="text-secondary-foreground/80 hover:text-primary-light transition-colors duration-200">{service}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-primary-light">Khu Vực</h4>
            <ul className="space-y-3">
              {areas.map((area) => (
                <li key={area}><a href="#" className="text-secondary-foreground/80 hover:text-primary-light transition-colors duration-200">BĐS {area}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-primary-light">Kết Nối</h4>
            <div className="flex flex-wrap gap-3 mb-6">
              {activeSocials.length > 0 ? (
                activeSocials.map(([key, url]) => {
                  const Icon = socialIcons[key] || Globe;
                  return (
                    <a key={key} href={url as string} target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="outline" className="border-primary-light text-primary-light hover:bg-primary-light hover:text-secondary">
                        <Icon className="w-4 h-4" />
                      </Button>
                    </a>
                  );
                })
              ) : (
                [Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
                  <Button key={i} size="icon" variant="outline" className="border-primary-light text-primary-light hover:bg-primary-light hover:text-secondary">
                    <Icon className="w-4 h-4" />
                  </Button>
                ))
              )}
            </div>
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.url || "#"} className="text-secondary-foreground/80 hover:text-primary-light transition-colors duration-200 text-sm">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-secondary-foreground/60">{copyright}</div>
            <div className="flex items-center gap-4 text-sm text-secondary-foreground/60">
              <span>Giấy phép kinh doanh: {businessLicense}</span>
              <span>|</span>
              <span>Cập nhật: {new Date().toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

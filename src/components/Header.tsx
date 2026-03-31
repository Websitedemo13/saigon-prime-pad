import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";

const defaultNavLinks = [
  { label: "Trang chủ", href: "#hero" },
  { label: "Giới thiệu", href: "#about" },
  { label: "Dự án", href: "#properties" },
  { label: "Bản đồ", href: "#map" },
  { label: "Đánh giá", href: "#reviews" },
  { label: "Liên hệ", href: "#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: logoContent } = useSiteContent("logo");
  const { data: contactContent } = useSiteContent("contact");
  const { data: headerContent } = useSiteContent("header");
  const logo = logoContent?.content as Record<string, any> | null;
  const contact = contactContent?.content as Record<string, any> | null;
  const header = headerContent?.content as Record<string, any> | null;

  const logoText = logo?.text || "VSM";
  const logoSubtitle = logo?.subtitle || "Real Estate";
  const logoImage = logo?.imageUrl || "";
  const phone = header?.phone || contact?.phone || "0123.456.789";
  const ctaText = header?.ctaText || "Tư Vấn Ngay";
  const navLinks = header?.navLinks?.length ? header.navLinks : defaultNavLinks;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setIsMobileOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = href;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-secondary/95 backdrop-blur-xl shadow-lg py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          {logoImage ? (
            <img src={logoImage} alt={logoText} className="h-10 object-contain group-hover:scale-110 transition-transform" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center font-bold text-primary-foreground text-lg tracking-tight group-hover:scale-110 transition-transform">
              {logoText}
            </div>
          )}
          <div className="hidden sm:block">
            <span className="text-xl font-bold text-white tracking-tight">
              {logoText} <span className="text-gradient">{logoSubtitle}</span>
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link: any) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="relative px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors group"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-primary rounded-full group-hover:w-3/4 transition-all duration-300" />
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href={`tel:${phone.replace(/\./g, '')}`} className="flex items-center gap-2 text-primary-light font-semibold text-sm hover:text-white transition-colors">
            <Phone className="w-4 h-4" />{phone}
          </a>
          <Button className="btn-primary text-sm" onClick={() => scrollTo("#contact")}>{ctaText}</Button>
        </div>

        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden text-white p-2">
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileOpen && (
        <div className="lg:hidden bg-secondary/98 backdrop-blur-xl border-t border-white/10 animate-fade-in">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
            {navLinks.map((link: any) => (
              <button key={link.href} onClick={() => scrollTo(link.href)} className="text-left px-4 py-3 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium">
                {link.label}
              </button>
            ))}
            <div className="border-t border-white/10 mt-2 pt-4">
              <Button className="btn-primary w-full" onClick={() => scrollTo("#contact")}>
                <Phone className="w-4 h-4 mr-2" /> {ctaText} — {phone}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

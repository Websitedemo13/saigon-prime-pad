import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Maximize2, Images, Bed, UtensilsCrossed, TreePine, Bath, Sofa, Car, Home, Lamp, Waves } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ScrollReveal";
import type { DetailSection } from "@/hooks/useProperties";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  bed: Bed,
  utensils: UtensilsCrossed,
  tree: TreePine,
  bath: Bath,
  sofa: Sofa,
  car: Car,
  home: Home,
  lamp: Lamp,
  waves: Waves,
  images: Images,
};

const GRADIENT_COLORS = [
  "from-rose-500 to-pink-500",
  "from-violet-500 to-purple-500",
  "from-sky-500 to-blue-500",
  "from-emerald-500 to-green-500",
  "from-amber-500 to-orange-500",
  "from-cyan-500 to-teal-500",
  "from-fuchsia-500 to-pink-500",
  "from-lime-500 to-emerald-500",
];

interface Props {
  sections: DetailSection[];
  onOpenLightbox: (images: string[], startIndex: number) => void;
}

export default function PropertyDetailSections({ sections, onOpenLightbox }: Props) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  if (!sections || sections.length === 0) return null;

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setOpenSections(new Set(sections.map((s) => s.id)));
  };

  const collapseAll = () => {
    setOpenSections(new Set());
  };

  return (
    <ScrollReveal delay={0.25}>
      <Card className="border-0 shadow-card overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Images className="w-6 h-6 text-primary" />
              Chi Tiết Không Gian
            </h2>
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
              >
                Mở tất cả
              </button>
              <button
                onClick={collapseAll}
                className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-medium"
              >
                Thu gọn
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {sections.map((section, index) => {
              const isOpen = openSections.has(section.id);
              const IconComponent = ICON_MAP[section.icon] || Images;
              const gradient = GRADIENT_COLORS[index % GRADIENT_COLORS.length];

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border border-border overflow-hidden bg-card hover:shadow-md transition-shadow"
                >
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center gap-4 p-4 md:p-5 text-left group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {section.title}
                      </h3>
                      {section.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                          {section.description}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="shrink-0 mr-2">
                      {section.images.length} ảnh
                    </Badge>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="shrink-0"
                    >
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </button>

                  {/* Section Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 md:px-5 pb-5">
                          {section.description && (
                            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                              {section.description}
                            </p>
                          )}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {section.images.map((img, i) => (
                              <motion.button
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.06 }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => onOpenLightbox(section.images, i)}
                                className="relative group rounded-xl overflow-hidden aspect-[4/3] shadow-sm"
                              >
                                <img
                                  src={img}
                                  alt={`${section.title} - ${i + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                                    <Maximize2 className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </ScrollReveal>
  );
}

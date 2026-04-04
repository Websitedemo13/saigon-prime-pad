import { useState, useEffect } from "react";
import { Palette, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ADMIN_THEMES = [
  {
    id: "gold-navy",
    name: "Vàng & Navy",
    desc: "Sang trọng cổ điển",
    colors: { primary: "45 100% 35%", secondary: "215 100% 20%", accent: "45 100% 95%" },
    preview: ["hsl(45,100%,35%)", "hsl(215,100%,20%)"],
  },
  {
    id: "emerald",
    name: "Ngọc Lục Bảo",
    desc: "Tươi mát & hiện đại",
    colors: { primary: "160 84% 39%", secondary: "160 60% 12%", accent: "160 70% 95%" },
    preview: ["hsl(160,84%,39%)", "hsl(160,60%,12%)"],
  },
  {
    id: "rose",
    name: "Hồng Sang",
    desc: "Nữ tính & tinh tế",
    colors: { primary: "340 82% 52%", secondary: "340 50% 15%", accent: "340 80% 96%" },
    preview: ["hsl(340,82%,52%)", "hsl(340,50%,15%)"],
  },
  {
    id: "ocean",
    name: "Đại Dương",
    desc: "Mát mẻ & chuyên nghiệp",
    colors: { primary: "200 98% 39%", secondary: "210 80% 15%", accent: "200 80% 95%" },
    preview: ["hsl(200,98%,39%)", "hsl(210,80%,15%)"],
  },
  {
    id: "sunset",
    name: "Hoàng Hôn",
    desc: "Ấm áp & năng động",
    colors: { primary: "25 95% 53%", secondary: "15 70% 15%", accent: "25 90% 95%" },
    preview: ["hsl(25,95%,53%)", "hsl(15,70%,15%)"],
  },
  {
    id: "violet",
    name: "Tím Hoàng Gia",
    desc: "Quý phái & bí ẩn",
    colors: { primary: "270 76% 53%", secondary: "270 50% 12%", accent: "270 70% 96%" },
    preview: ["hsl(270,76%,53%)", "hsl(270,50%,12%)"],
  },
];

const STORAGE_KEY = "admin-theme";

export function useAdminTheme() {
  const [themeId, setThemeId] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || "gold-navy"; } catch { return "gold-navy"; }
  });

  useEffect(() => {
    const theme = ADMIN_THEMES.find((t) => t.id === themeId);
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.colors.primary);
    root.style.setProperty("--secondary", theme.colors.secondary);
    root.style.setProperty("--accent", theme.colors.accent);
    root.style.setProperty("--ring", theme.colors.primary);
    root.style.setProperty("--primary-light", adjustLightness(theme.colors.primary, 15));
    root.style.setProperty("--primary-dark", adjustLightness(theme.colors.primary, -10));
    root.style.setProperty("--secondary-light", adjustLightness(theme.colors.secondary, 10));
    try { localStorage.setItem(STORAGE_KEY, themeId); } catch {}
  }, [themeId]);

  return { themeId, setThemeId, themes: ADMIN_THEMES };
}

function adjustLightness(hsl: string, delta: number): string {
  const parts = hsl.split(" ");
  if (parts.length < 3) return hsl;
  const l = parseFloat(parts[2]);
  return `${parts[0]} ${parts[1]} ${Math.max(0, Math.min(100, l + delta))}%`;
}

export function AdminThemeSwitcher() {
  const { themeId, setThemeId, themes } = useAdminTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 gap-2 px-2 sm:px-3">
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="end">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Chọn giao diện Admin</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((theme) => {
            const active = themeId === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setThemeId(theme.id)}
                className={cn(
                  "relative flex flex-col items-start gap-1 p-2.5 rounded-xl border-2 transition-all duration-200 text-left group hover:scale-[1.02]",
                  active
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/40 hover:bg-muted/50"
                )}
              >
                {active && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                  </div>
                )}
                <div className="flex gap-1">
                  {theme.preview.map((color, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold">{theme.name}</span>
                <span className="text-[10px] text-muted-foreground leading-tight">{theme.desc}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

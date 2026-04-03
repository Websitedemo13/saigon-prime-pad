import { useState } from "react";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DetailSection } from "@/hooks/useProperties";

const ICON_OPTIONS = [
  { value: "bed", label: "🛏️ Phòng ngủ" },
  { value: "utensils", label: "🍽️ Phòng ăn" },
  { value: "sofa", label: "🛋️ Phòng khách" },
  { value: "bath", label: "🚿 Phòng tắm" },
  { value: "tree", label: "🌳 Sân vườn" },
  { value: "car", label: "🚗 Gara xe" },
  { value: "home", label: "🏠 Tổng quan" },
  { value: "lamp", label: "💡 Nội thất" },
  { value: "waves", label: "🏊 Hồ bơi" },
  { value: "images", label: "📷 Khác" },
];

interface Props {
  sections: DetailSection[];
  onChange: (sections: DetailSection[]) => void;
}

export default function DetailSectionsEditor({ sections, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addSection = () => {
    const newSection: DetailSection = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      images: [],
      icon: "images",
    };
    onChange([...sections, newSection]);
    setExpandedId(newSection.id);
  };

  const removeSection = (id: string) => {
    onChange(sections.filter((s) => s.id !== id));
  };

  const updateSection = (id: string, field: keyof DetailSection, value: any) => {
    onChange(sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const arr = [...sections];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    onChange(arr);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const arr = [...sections];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    onChange(arr);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-primary" />
          Chi tiết không gian ({sections.length} phân khu)
        </label>
        <Button type="button" variant="outline" size="sm" onClick={addSection}>
          <Plus className="w-4 h-4 mr-1" /> Thêm phân khu
        </Button>
      </div>

      {sections.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Chưa có phân khu nào</p>
          <p className="text-xs">Thêm phân khu để chi tiết hóa từng không gian (phòng ngủ, sân vườn...)</p>
        </div>
      )}

      {sections.map((section, index) => {
        const isExpanded = expandedId === section.id;
        const iconLabel = ICON_OPTIONS.find((o) => o.value === section.icon)?.label || "📷 Khác";

        return (
          <Card key={section.id} className="border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 p-3 bg-muted/30">
              <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : section.id)}
                className="flex-1 flex items-center gap-2 text-left min-w-0"
              >
                <span className="text-lg">{iconLabel.split(" ")[0]}</span>
                <span className="font-medium text-sm truncate">
                  {section.title || "Chưa đặt tên"}
                </span>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {section.images.length} ảnh
                </Badge>
              </button>
              <div className="flex items-center gap-1 shrink-0">
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveUp(index)} disabled={index === 0}>
                  <ChevronUp className="w-3 h-3" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveDown(index)} disabled={index === sections.length - 1}>
                  <ChevronDown className="w-3 h-3" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeSection(section.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="p-4 space-y-3 border-t">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Tên phân khu</label>
                    <Input
                      placeholder="VD: Phòng ngủ Master"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Icon</label>
                    <Select value={section.icon} onValueChange={(v) => updateSection(section.id, "icon", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Mô tả</label>
                  <Textarea
                    rows={2}
                    placeholder="Mô tả ngắn về không gian này..."
                    value={section.description}
                    onChange={(e) => updateSection(section.id, "description", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Ảnh (mỗi dòng 1 URL)</label>
                  <Textarea
                    rows={4}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    value={section.images.join("\n")}
                    onChange={(e) =>
                      updateSection(section.id, "images", e.target.value.split("\n").filter(Boolean))
                    }
                  />
                </div>
                {section.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {section.images.map((img, i) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden border">
                        <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

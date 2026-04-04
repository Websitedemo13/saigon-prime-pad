import { useState } from "react";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Image as ImageIcon, X, Upload, Loader2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { DetailSection } from "@/hooks/useProperties";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

function SortableImage({ id, url, onRemove }: { id: string; url: string; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/30 transition-colors">
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
      />
      <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
      {isDragging && (
        <div className="absolute inset-0 bg-primary/20 ring-2 ring-primary rounded-lg" />
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-3 h-3 text-white mx-auto" />
      </div>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-20"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

interface Props {
  sections: DetailSection[];
  onChange: (sections: DetailSection[]) => void;
}

export default function DetailSectionsEditor({ sections, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const removeImage = (sectionId: string, imgIndex: number) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const newImages = section.images.filter((_, i) => i !== imgIndex);
    updateSection(sectionId, "images", newImages);
  };

  const handleImageDragEnd = (sectionId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const oldIndex = section.images.findIndex((_, i) => `img-${i}` === active.id);
    const newIndex = section.images.findIndex((_, i) => `img-${i}` === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newImages = arrayMove(section.images, oldIndex, newIndex);
      updateSection(sectionId, "images", newImages);
    }
  };

  const handleUploadImages = async (sectionId: string, files: FileList) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const maxSize = 5 * 1024 * 1024;
    const validFiles = Array.from(files).filter((f) => {
      if (f.size > maxSize) {
        toast({ title: `${f.name} quá lớn`, description: "Tối đa 5MB/ảnh", variant: "destructive" });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploadingFor(sectionId);
    const newUrls: string[] = [];

    try {
      for (const file of validFiles) {
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
        const filePath = `uploads/${fileName}`;

        const { error } = await supabase.storage
          .from("site-media")
          .upload(filePath, file, { upsert: true });
        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("site-media")
          .getPublicUrl(filePath);
        newUrls.push(urlData.publicUrl);
      }

      updateSection(sectionId, "images", [...section.images, ...newUrls]);
      toast({ title: `Đã tải ${newUrls.length} ảnh thành công!` });
    } catch (err: any) {
      toast({ title: "Lỗi tải ảnh", description: err.message, variant: "destructive" });
    } finally {
      setUploadingFor(null);
    }
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
        const isUploading = uploadingFor === section.id;

        return (
          <Card key={section.id} className="border shadow-sm overflow-hidden">
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

                {/* Image Upload Area */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Ảnh phân khu (kéo thả để sắp xếp)</label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
                      isUploading ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.dataTransfer.files.length > 0) {
                        handleUploadImages(section.id, e.dataTransfer.files);
                      }
                    }}
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center gap-2 py-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span className="text-sm text-primary font-medium">Đang tải ảnh lên...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Kéo thả ảnh vào đây hoặc</p>
                        <label className="inline-block mt-1">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                handleUploadImages(section.id, e.target.files);
                                e.target.value = "";
                              }
                            }}
                          />
                          <span className="text-sm font-medium text-primary cursor-pointer hover:underline">
                            chọn từ máy tính
                          </span>
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">Hỗ trợ nhiều ảnh, tối đa 5MB/ảnh</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Image Grid with Drag & Drop */}
                {section.images.length > 0 && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => handleImageDragEnd(section.id, event)}
                  >
                    <SortableContext
                      items={section.images.map((_, i) => `img-${i}`)}
                      strategy={rectSortingStrategy}
                    >
                      <div className="grid grid-cols-4 gap-2">
                        {section.images.map((img, i) => (
                          <SortableImage
                            key={`img-${i}`}
                            id={`img-${i}`}
                            url={img}
                            onRemove={() => removeImage(section.id, i)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

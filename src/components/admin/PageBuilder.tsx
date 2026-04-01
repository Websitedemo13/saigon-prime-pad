import { useState, useCallback, useEffect } from "react";
import {
  Eye, EyeOff, GripVertical, Plus, Trash2, Save, Layout, FileText,
  Building2, MapPin, MessageSquare, Phone, Code, Pencil, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent, useUpdateSiteContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ICON_MAP: Record<string, any> = {
  Layout, FileText, Building2, MapPin, MessageSquare, Phone, Code,
};

interface SectionItem {
  id: string;
  type: "builtin" | "custom";
  label: string;
  visible: boolean;
  icon: string;
}

interface CustomSectionData {
  title: string;
  content: string;
  backgroundImage?: string;
  backgroundColor?: string;
}

interface PageLayout {
  sections: SectionItem[];
  customSections: Record<string, CustomSectionData>;
}

function SortableSectionItem({
  section, onToggle, onEdit, onDelete,
}: {
  section: SectionItem;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const Icon = ICON_MAP[section.icon] || Code;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border bg-card shadow-sm transition-all ${
        !section.visible ? "opacity-50 bg-muted/30" : ""
      } ${isDragging ? "shadow-xl z-50 ring-2 ring-primary" : "hover:shadow-md"}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-muted shrink-0"
        aria-label="Kéo để sắp xếp"
      >
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </button>

      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm sm:text-base truncate">{section.label}</h3>
          <Badge variant={section.type === "custom" ? "default" : "secondary"} className="text-[10px]">
            {section.type === "custom" ? "Tùy chỉnh" : "Mặc định"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {section.visible ? "Đang hiển thị" : "Đang ẩn"}
        </p>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <Switch checked={section.visible} onCheckedChange={onToggle} />
        {section.type === "custom" && onEdit && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
        )}
        {section.type === "custom" && onDelete && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function PageBuilder() {
  const { toast } = useToast();
  const { data: layoutData, isLoading } = useSiteContent("page_layout");
  const updateMutation = useUpdateSiteContent();

  const [layout, setLayout] = useState<PageLayout>({
    sections: [],
    customSections: {},
  });
  const [editingCustomId, setEditingCustomId] = useState<string | null>(null);
  const [customForm, setCustomForm] = useState<CustomSectionData>({
    title: "", content: "", backgroundImage: "", backgroundColor: "",
  });
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    if (layoutData?.content) {
      const c = layoutData.content as any;
      setLayout({
        sections: c.sections || [],
        customSections: c.customSections || {},
      });
    }
  }, [layoutData]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLayout((prev) => {
      const oldIdx = prev.sections.findIndex((s) => s.id === active.id);
      const newIdx = prev.sections.findIndex((s) => s.id === over.id);
      return { ...prev, sections: arrayMove(prev.sections, oldIdx, newIdx) };
    });
  }, []);

  const toggleVisibility = (id: string) => {
    setLayout((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => s.id === id ? { ...s, visible: !s.visible } : s),
    }));
  };

  const saveLayout = async () => {
    try {
      await updateMutation.mutateAsync({
        sectionKey: "page_layout",
        content: layout as unknown as Json,
      });
      toast({ title: "Đã lưu bố cục trang!" });
    } catch {
      toast({ title: "Lỗi", description: "Không thể lưu.", variant: "destructive" });
    }
  };

  const startCreateCustom = () => {
    setIsCreatingNew(true);
    setEditingCustomId(null);
    setCustomForm({ title: "", content: "", backgroundImage: "", backgroundColor: "" });
  };

  const startEditCustom = (id: string) => {
    setIsCreatingNew(false);
    setEditingCustomId(id);
    setCustomForm(layout.customSections[id] || { title: "", content: "" });
  };

  const cancelEdit = () => {
    setIsCreatingNew(false);
    setEditingCustomId(null);
  };

  const saveCustomSection = () => {
    if (!customForm.title.trim()) {
      toast({ title: "Lỗi", description: "Tiêu đề không được trống.", variant: "destructive" });
      return;
    }

    const id = editingCustomId || `custom_${Date.now()}`;
    setLayout((prev) => {
      const newCustomSections = { ...prev.customSections, [id]: customForm };
      let newSections = [...prev.sections];
      if (!editingCustomId) {
        newSections.push({
          id,
          type: "custom",
          label: customForm.title,
          visible: true,
          icon: "Code",
        });
      } else {
        newSections = newSections.map((s) =>
          s.id === id ? { ...s, label: customForm.title } : s
        );
      }
      return { sections: newSections, customSections: newCustomSections };
    });
    cancelEdit();
    toast({ title: editingCustomId ? "Đã cập nhật section!" : "Đã tạo section mới!" });
  };

  const deleteCustomSection = (id: string) => {
    if (!confirm("Xóa section tùy chỉnh này?")) return;
    setLayout((prev) => {
      const { [id]: _, ...rest } = prev.customSections;
      return {
        sections: prev.sections.filter((s) => s.id !== id),
        customSections: rest,
      };
    });
    toast({ title: "Đã xóa section!" });
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Layout className="w-5 h-5 text-primary" /> Bố cục trang chủ
          </h2>
          <p className="text-sm text-muted-foreground">
            Kéo thả để sắp xếp • Bật/tắt hiển thị • Tạo section tùy chỉnh
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={startCreateCustom} disabled={isCreatingNew}>
            <Plus className="w-4 h-4 mr-2" /> Thêm Section
          </Button>
          <Button onClick={saveLayout} disabled={updateMutation.isPending} className="btn-primary">
            <Save className="w-4 h-4 mr-2" />
            {updateMutation.isPending ? "Đang lưu..." : "Lưu bố cục"}
          </Button>
        </div>
      </div>

      {/* Custom Section Editor */}
      {(isCreatingNew || editingCustomId) && (
        <Card className="border-2 border-primary/30 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              {isCreatingNew ? "Tạo section mới" : "Chỉnh sửa section"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Tiêu đề section *</label>
              <Input
                value={customForm.title}
                onChange={(e) => setCustomForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="VD: Giải thưởng, Đối tác, Banner quảng cáo..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Nội dung (Rich Text)</label>
              <RichTextEditor
                value={customForm.content}
                onChange={(html) => setCustomForm((p) => ({ ...p, content: html }))}
                minHeight="200px"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Ảnh nền</label>
                <ImageUpload
                  value={customForm.backgroundImage || ""}
                  onChange={(url) => setCustomForm((p) => ({ ...p, backgroundImage: url }))}
                  label="Background"
                  previewClassName="h-24 w-full object-cover"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Màu nền (CSS)</label>
                <Input
                  value={customForm.backgroundColor || ""}
                  onChange={(e) => setCustomForm((p) => ({ ...p, backgroundColor: e.target.value }))}
                  placeholder="VD: #f5f5f5, linear-gradient(...)"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={saveCustomSection} className="btn-primary">
                <Save className="w-4 h-4 mr-2" /> {isCreatingNew ? "Tạo section" : "Cập nhật"}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X className="w-4 h-4 mr-2" /> Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sortable Sections List */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={layout.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {layout.sections.map((section) => (
              <SortableSectionItem
                key={section.id}
                section={section}
                onToggle={() => toggleVisibility(section.id)}
                onEdit={section.type === "custom" ? () => startEditCustom(section.id) : undefined}
                onDelete={section.type === "custom" ? () => deleteCustomSection(section.id) : undefined}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {layout.sections.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Layout className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Chưa có dữ liệu bố cục. Vui lòng tải lại trang.</p>
        </div>
      )}
    </div>
  );
}

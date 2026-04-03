import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Save, Building2, Eye, EyeOff, GripVertical, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAllProperties, useCreateProperty, useUpdateProperty, useDeleteProperty, useReorderProperties, DbProperty } from "@/hooks/useProperties";
import ImageUpload from "@/components/admin/ImageUpload";
import DetailSectionsEditor from "@/components/admin/DetailSectionsEditor";
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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const emptyProperty: Partial<DbProperty> = {
  title: "", slug: "", location: "", district: "", price: "", price_num: 0,
  price_per_m2: "", area: "", area_num: 0, bedrooms: 0, bathrooms: 0,
  type: "", status: "", roi: "", image: "", gallery: [], features: [],
  description: "", amenities: [], developer: "", year_built: "", floors: 0,
  parking: "", nearby_places: [], sort_order: 0, is_active: true,
  latitude: null, longitude: null,
};

function SortablePropertyItem({
  property, onEdit, onDelete, onToggleActive, isEditing,
}: {
  property: DbProperty;
  onEdit: (p: DbProperty) => void;
  onDelete: (id: string, title: string) => void;
  onToggleActive: (p: DbProperty) => void;
  isEditing: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: property.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <Card ref={setNodeRef} style={style} className={`border shadow-sm ${!property.is_active ? "opacity-60" : ""} ${isDragging ? "shadow-lg" : ""}`}>
      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
        <button
          {...attributes}
          {...listeners}
          className="touch-none cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted shrink-0"
          aria-label="Kéo để sắp xếp"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </button>

        {property.image ? (
          <img src={property.image} alt={property.title} className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm sm:text-base truncate">{property.title}</h3>
            {!property.is_active && <Badge variant="secondary" className="text-xs">Ẩn</Badge>}
            {property.latitude && property.longitude && (
              <Badge variant="outline" className="text-xs gap-1">
                <MapPin className="w-3 h-3" /> GPS
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <span>{property.type}</span>
            <span>•</span>
            <span>{property.price}</span>
            <span>•</span>
            <span>{property.district}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onToggleActive(property)}>
            {property.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(property)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(property.id, property.title)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function PropertiesAdmin() {
  const { toast } = useToast();
  const { data: properties, isLoading } = useAllProperties();
  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const deleteMutation = useDeleteProperty();
  const reorderMutation = useReorderProperties();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<DbProperty>>(emptyProperty);
  const [isCreating, setIsCreating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setForm({ ...emptyProperty, sort_order: (properties?.length || 0) + 1 });
  };

  const startEdit = (p: DbProperty) => {
    setIsCreating(false);
    setEditingId(p.id);
    setForm({ ...p });
  };

  const cancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setForm(emptyProperty);
  };

  const updateFormField = (field: string, value: any) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && (isCreating || !prev.slug)) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const updateArrayField = (field: string, value: string) => {
    const arr = value.split("\n").filter(Boolean);
    setForm((prev) => ({ ...prev, [field]: arr }));
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) {
      toast({ title: "Lỗi", description: "Tiêu đề và slug không được trống.", variant: "destructive" });
      return;
    }
    try {
      if (isCreating) {
        await createMutation.mutateAsync(form);
        toast({ title: "Đã tạo dự án mới!" });
      } else if (editingId) {
        await updateMutation.mutateAsync({ ...form, id: editingId } as any);
        toast({ title: "Đã cập nhật dự án!" });
      }
      cancel();
    } catch (err: any) {
      toast({ title: "Lỗi", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Xóa dự án "${title}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Đã xóa dự án!" });
    } catch (err: any) {
      toast({ title: "Lỗi", description: err.message, variant: "destructive" });
    }
  };

  const toggleActive = async (p: DbProperty) => {
    try {
      await updateMutation.mutateAsync({ id: p.id, is_active: !p.is_active } as any);
      toast({ title: p.is_active ? "Đã ẩn dự án" : "Đã hiện dự án" });
    } catch (err: any) {
      toast({ title: "Lỗi", description: err.message, variant: "destructive" });
    }
  };

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !properties) return;

    const oldIndex = properties.findIndex((p) => p.id === active.id);
    const newIndex = properties.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(properties, oldIndex, newIndex);

    const updates = reordered.map((p, i) => ({ id: p.id, sort_order: i + 1 }));
    try {
      await reorderMutation.mutateAsync(updates);
      toast({ title: "Đã cập nhật thứ tự!" });
    } catch {
      toast({ title: "Lỗi", description: "Không thể cập nhật thứ tự.", variant: "destructive" });
    }
  }, [properties, reorderMutation, toast]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Danh sách dự án ({properties?.length || 0})</h2>
          <p className="text-sm text-muted-foreground">Kéo thả để sắp xếp thứ tự • Quản lý thêm/sửa/xóa dự án</p>
        </div>
        <Button onClick={startCreate} disabled={isCreating} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" /> Thêm dự án
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card className="border-2 border-primary/30 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              {isCreating ? "Thêm dự án mới" : "Chỉnh sửa dự án"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Tiêu đề *</label>
                <Input value={form.title || ""} onChange={(e) => updateFormField("title", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Slug *</label>
                <Input value={form.slug || ""} onChange={(e) => updateFormField("slug", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Vị trí</label>
                <Input placeholder="Quận X, TP.HCM" value={form.location || ""} onChange={(e) => updateFormField("location", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Quận/Huyện</label>
                <Input placeholder="Quận 1" value={form.district || ""} onChange={(e) => updateFormField("district", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Giá (hiển thị)</label>
                <Input placeholder="5.2 tỷ" value={form.price || ""} onChange={(e) => updateFormField("price", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Giá (số, đơn vị tỷ)</label>
                <Input type="number" step="0.1" value={form.price_num || 0} onChange={(e) => updateFormField("price_num", parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Giá/m²</label>
                <Input placeholder="85 triệu/m²" value={form.price_per_m2 || ""} onChange={(e) => updateFormField("price_per_m2", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Diện tích (hiển thị)</label>
                <Input placeholder="75m²" value={form.area || ""} onChange={(e) => updateFormField("area", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Diện tích (số m²)</label>
                <Input type="number" value={form.area_num || 0} onChange={(e) => updateFormField("area_num", parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Loại BĐS</label>
                <Input placeholder="Căn hộ, Biệt thự..." value={form.type || ""} onChange={(e) => updateFormField("type", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Phòng ngủ</label>
                <Input type="number" value={form.bedrooms || 0} onChange={(e) => updateFormField("bedrooms", parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Phòng tắm</label>
                <Input type="number" value={form.bathrooms || 0} onChange={(e) => updateFormField("bathrooms", parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Trạng thái</label>
                <Input placeholder="Sẵn sàng bàn giao" value={form.status || ""} onChange={(e) => updateFormField("status", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">ROI</label>
                <Input placeholder="+12%/năm" value={form.roi || ""} onChange={(e) => updateFormField("roi", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Chủ đầu tư</label>
                <Input value={form.developer || ""} onChange={(e) => updateFormField("developer", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Năm bàn giao</label>
                <Input value={form.year_built || ""} onChange={(e) => updateFormField("year_built", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Số tầng</label>
                <Input type="number" value={form.floors || 0} onChange={(e) => updateFormField("floors", parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Bãi đỗ xe</label>
                <Input value={form.parking || ""} onChange={(e) => updateFormField("parking", e.target.value)} />
              </div>
            </div>

            {/* GPS Coordinates */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Tọa độ GPS (hiển thị trên bản đồ)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Vĩ độ (Latitude)</label>
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="10.7769"
                    value={form.latitude ?? ""}
                    onChange={(e) => updateFormField("latitude", e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Kinh độ (Longitude)</label>
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="106.7009"
                    value={form.longitude ?? ""}
                    onChange={(e) => updateFormField("longitude", e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Ảnh đại diện</label>
              <ImageUpload value={form.image || ""} onChange={(url) => updateFormField("image", url)} previewClassName="h-32 w-full object-cover" />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Mô tả</label>
              <Textarea rows={3} value={form.description || ""} onChange={(e) => updateFormField("description", e.target.value)} />
            </div>

            {/* Array fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Đặc điểm (mỗi dòng 1 mục)</label>
                <Textarea rows={3} value={(form.features || []).join("\n")} onChange={(e) => updateArrayField("features", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Tiện ích (mỗi dòng 1 mục)</label>
                <Textarea rows={3} value={(form.amenities || []).join("\n")} onChange={(e) => updateArrayField("amenities", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Vị trí lân cận (mỗi dòng 1 mục)</label>
                <Textarea rows={3} value={(form.nearby_places || []).join("\n")} onChange={(e) => updateArrayField("nearby_places", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Gallery URLs (mỗi dòng 1 URL)</label>
                <Textarea rows={3} value={(form.gallery || []).join("\n")} onChange={(e) => updateArrayField("gallery", e.target.value)} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={isSaving} className="btn-primary">
                <Save className="w-4 h-4 mr-2" /> {isSaving ? "Đang lưu..." : "Lưu"}
              </Button>
              <Button variant="outline" onClick={cancel}>
                <X className="w-4 h-4 mr-2" /> Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sortable Properties List */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={properties?.map((p) => p.id) || []} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {properties?.map((p) => (
              <SortablePropertyItem
                key={p.id}
                property={p}
                onEdit={startEdit}
                onDelete={handleDelete}
                onToggleActive={toggleActive}
                isEditing={editingId === p.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

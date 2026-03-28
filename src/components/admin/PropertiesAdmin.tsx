import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Building2, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAllProperties, useCreateProperty, useUpdateProperty, useDeleteProperty, DbProperty } from "@/hooks/useProperties";
import ImageUpload from "@/components/admin/ImageUpload";

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
};

export default function PropertiesAdmin() {
  const { toast } = useToast();
  const { data: properties, isLoading } = useAllProperties();
  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const deleteMutation = useDeleteProperty();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<DbProperty>>(emptyProperty);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setForm({ ...emptyProperty, sort_order: (properties?.length || 0) + 1 });
  };

  const startEdit = (p: DbProperty) => {
    setIsCreating(false);
    setEditingId(p.id);
    setForm({ ...p });
    setExpandedId(p.id);
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

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Danh sách dự án ({properties?.length || 0})</h2>
          <p className="text-sm text-muted-foreground">Quản lý thêm/sửa/xóa dự án bất động sản</p>
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
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Thứ tự hiển thị</label>
                <Input type="number" value={form.sort_order || 0} onChange={(e) => updateFormField("sort_order", parseInt(e.target.value) || 0)} />
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

      {/* Properties List */}
      <div className="space-y-3">
        {properties?.map((p) => (
          <Card key={p.id} className={`border shadow-sm ${!p.is_active ? "opacity-60" : ""}`}>
            <div
              className="flex items-center gap-3 p-3 sm:p-4 cursor-pointer"
              onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
            >
              {p.image ? (
                <img src={p.image} alt={p.title} className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-sm sm:text-base truncate">{p.title}</h3>
                  {!p.is_active && <Badge variant="secondary" className="text-xs">Ẩn</Badge>}
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span>{p.type}</span>
                  <span>•</span>
                  <span>{p.price}</span>
                  <span>•</span>
                  <span>{p.district}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); toggleActive(p); }}>
                  {p.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); startEdit(p); }}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(p.id, p.title); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                {expandedId === p.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
            {expandedId === p.id && editingId !== p.id && (
              <CardContent className="pt-0 pb-4 px-4 border-t border-border">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mt-3">
                  <div><span className="text-muted-foreground">Diện tích:</span> {p.area}</div>
                  <div><span className="text-muted-foreground">Phòng ngủ:</span> {p.bedrooms}</div>
                  <div><span className="text-muted-foreground">Chủ đầu tư:</span> {p.developer}</div>
                  <div><span className="text-muted-foreground">ROI:</span> {p.roi}</div>
                </div>
                {p.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.description}</p>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

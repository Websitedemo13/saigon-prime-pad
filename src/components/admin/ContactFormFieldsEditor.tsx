import { useState } from "react";
import { Plus, Trash2, GripVertical, Type, Mail, Phone, AlignLeft, ListChecks, ChevronUp, ChevronDown, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { FormFieldConfig } from "@/components/Contact";

const FIELD_TYPE_OPTIONS = [
  { value: "text", label: "Văn bản", icon: Type },
  { value: "email", label: "Email", icon: Mail },
  { value: "tel", label: "Số điện thoại", icon: Phone },
  { value: "textarea", label: "Đoạn văn", icon: AlignLeft },
  { value: "select", label: "Danh sách chọn", icon: ListChecks },
];

const DB_FIELD_OPTIONS = [
  { value: "name", label: "Họ tên (name)" },
  { value: "phone", label: "SĐT (phone)" },
  { value: "email", label: "Email (email)" },
  { value: "service", label: "Dịch vụ (service)" },
  { value: "message", label: "Tin nhắn (message)" },
  { value: "extra", label: "Trường mở rộng (lưu vào message)" },
];

interface Props {
  fields: FormFieldConfig[];
  onChange: (fields: FormFieldConfig[]) => void;
}

export default function ContactFormFieldsEditor({ fields, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addField = () => {
    const newField: FormFieldConfig = {
      id: `field_${Date.now()}`,
      label: "Trường mới",
      type: "text",
      placeholder: "",
      required: false,
      dbField: "extra",
      options: [],
    };
    onChange([...fields, newField]);
    setExpandedId(newField.id);
  };

  const updateField = (index: number, updates: Partial<FormFieldConfig>) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeField = (index: number) => {
    const updated = [...fields];
    updated.splice(index, 1);
    onChange(updated);
  };

  const moveField = (index: number, dir: -1 | 1) => {
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= fields.length) return;
    const updated = [...fields];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  const getTypeIcon = (type: string) => {
    const found = FIELD_TYPE_OPTIONS.find(t => t.value === type);
    return found ? found.icon : Type;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary" />
            Cấu hình trường form liên hệ
          </h4>
          <p className="text-xs text-muted-foreground mt-1">Tùy chỉnh các trường mà khách hàng cần điền khi liên hệ</p>
        </div>
        <Button size="sm" onClick={addField} className="gap-1">
          <Plus className="w-4 h-4" /> Thêm trường
        </Button>
      </div>

      {fields.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Type className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Chưa có trường nào. Nhấn "Thêm trường" để bắt đầu.</p>
            <p className="text-xs mt-1">Hệ thống sẽ dùng form mặc định nếu không cấu hình.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {fields.map((field, index) => {
          const TypeIcon = getTypeIcon(field.type);
          const isExpanded = expandedId === field.id;

          return (
            <Card key={field.id} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                {/* Header row */}
                <div
                  className="flex items-center gap-3 p-3 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : field.id)}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <TypeIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{field.label}</span>
                      {field.required && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Bắt buộc</Badge>}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {FIELD_TYPE_OPTIONS.find(t => t.value === field.type)?.label} • {DB_FIELD_OPTIONS.find(d => d.value === field.dbField)?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); moveField(index, -1); }} disabled={index === 0}>
                      <ChevronUp className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); moveField(index, 1); }} disabled={index === fields.length - 1}>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); removeField(index); }}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Expanded editor */}
                {isExpanded && (
                  <div className="px-3 pb-4 pt-1 space-y-3 border-t border-border/50">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium mb-1 block">Nhãn hiển thị</label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(index, { label: e.target.value })}
                          placeholder="VD: Họ và tên"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Placeholder</label>
                        <Input
                          value={field.placeholder}
                          onChange={(e) => updateField(index, { placeholder: e.target.value })}
                          placeholder="VD: Nhập họ tên..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium mb-1 block">Loại trường</label>
                        <Select value={field.type} onValueChange={(v) => updateField(index, { type: v as FormFieldConfig["type"] })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {FIELD_TYPE_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Lưu vào cột DB</label>
                        <Select value={field.dbField} onValueChange={(v) => updateField(index, { dbField: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {DB_FIELD_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Switch checked={field.required} onCheckedChange={(v) => updateField(index, { required: v })} />
                      <label className="text-sm">Bắt buộc điền</label>
                    </div>

                    {/* Options for select type */}
                    {field.type === "select" && (
                      <div className="space-y-2">
                        <Separator />
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium">Các lựa chọn</label>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => updateField(index, { options: [...(field.options || []), "Lựa chọn mới"] })}
                          >
                            <Plus className="w-3 h-3 mr-1" /> Thêm
                          </Button>
                        </div>
                        {field.dbField === "service" && (
                          <p className="text-xs text-muted-foreground">
                            💡 Nếu để trống, sẽ dùng danh sách dịch vụ ở mục "Danh sách dịch vụ" bên dưới
                          </p>
                        )}
                        {(field.options || []).map((opt, oi) => (
                          <div key={oi} className="flex gap-2">
                            <Input
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...(field.options || [])];
                                newOpts[oi] = e.target.value;
                                updateField(index, { options: newOpts });
                              }}
                              className="h-8 text-sm"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive shrink-0"
                              onClick={() => {
                                const newOpts = [...(field.options || [])];
                                newOpts.splice(oi, 1);
                                updateField(index, { options: newOpts });
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

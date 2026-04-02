import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Trash2, Eye, Phone, Mail, MessageSquare, CheckCircle, Clock, AlertCircle, X, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  useContactSubmissions,
  useUpdateContactSubmission,
  useDeleteContactSubmission,
  type ContactSubmission,
} from "@/hooks/useContactSubmissions";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  new: { label: "Mới", color: "bg-blue-500", icon: AlertCircle },
  contacted: { label: "Đã liên hệ", color: "bg-amber-500", icon: Clock },
  done: { label: "Hoàn thành", color: "bg-green-500", icon: CheckCircle },
};

export default function ContactSubmissionsAdmin() {
  const { toast } = useToast();
  const { data: submissions, isLoading } = useContactSubmissions();
  const updateMutation = useUpdateContactSubmission();
  const deleteMutation = useDeleteContactSubmission();
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = submissions?.filter((s) => {
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.phone.includes(q) || s.email.toLowerCase().includes(q);
    }
    return true;
  });

  const counts = {
    all: submissions?.length || 0,
    new: submissions?.filter((s) => s.status === "new").length || 0,
    contacted: submissions?.filter((s) => s.status === "contacted").length || 0,
    done: submissions?.filter((s) => s.status === "done").length || 0,
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateMutation.mutateAsync({ id, status });
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
    toast({ title: "Đã cập nhật trạng thái!" });
  };

  const handleNotesChange = async (id: string, notes: string) => {
    await updateMutation.mutateAsync({ id, notes });
    toast({ title: "Đã lưu ghi chú!" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn chắc chắn muốn xóa?")) return;
    await deleteMutation.mutateAsync(id);
    setSelected(null);
    toast({ title: "Đã xóa!" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: "all", label: "Tổng cộng", color: "bg-primary" },
          { key: "new", label: "Mới", color: "bg-blue-500" },
          { key: "contacted", label: "Đã liên hệ", color: "bg-amber-500" },
          { key: "done", label: "Hoàn thành", color: "bg-green-500" },
        ].map((s) => (
          <Card key={s.key} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus(s.key)}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${s.color}`} />
              <div>
                <div className="text-2xl font-bold">{counts[s.key as keyof typeof counts]}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Tìm theo tên, SĐT, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả ({counts.all})</SelectItem>
            <SelectItem value="new">Mới ({counts.new})</SelectItem>
            <SelectItem value="contacted">Đã liên hệ ({counts.contacted})</SelectItem>
            <SelectItem value="done">Hoàn thành ({counts.done})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {!filtered?.length ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>Chưa có form liên hệ nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => {
            const cfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.new;
            const StatusIcon = cfg.icon;
            return (
              <Card key={sub.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full ${cfg.color} flex items-center justify-center shrink-0`}>
                        <StatusIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold">{sub.name}</span>
                          <Badge variant="outline" className="text-xs">{cfg.label}</Badge>
                          {sub.service && <Badge variant="secondary" className="text-xs">{sub.service}</Badge>}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{sub.phone}</span>
                          {sub.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{sub.email}</span>}
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(sub.created_at), "dd/MM/yyyy HH:mm", { locale: vi })}</span>
                        </div>
                        {sub.message && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{sub.message}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Select value={sub.status} onValueChange={(v) => handleStatusChange(sub.id, v)}>
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Mới</SelectItem>
                          <SelectItem value="contacted">Đã liên hệ</SelectItem>
                          <SelectItem value="done">Hoàn thành</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="icon" variant="ghost" onClick={() => setSelected(sub)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(sub.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Chi tiết liên hệ
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Họ tên:</span><p className="font-semibold">{selected.name}</p></div>
                <div><span className="text-muted-foreground">SĐT:</span><p className="font-semibold">{selected.phone}</p></div>
                <div><span className="text-muted-foreground">Email:</span><p className="font-semibold">{selected.email || "—"}</p></div>
                <div><span className="text-muted-foreground">Dịch vụ:</span><p className="font-semibold">{selected.service || "—"}</p></div>
              </div>
              <Separator />
              <div>
                <span className="text-sm text-muted-foreground">Tin nhắn:</span>
                <p className="mt-1 p-3 bg-muted/50 rounded-lg text-sm">{selected.message || "Không có tin nhắn"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Ngày gửi:</span>
                <p className="font-medium">{format(new Date(selected.created_at), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium flex items-center gap-1 mb-2"><StickyNote className="w-4 h-4" />Ghi chú nội bộ</label>
                <Textarea
                  defaultValue={selected.notes}
                  placeholder="Thêm ghi chú..."
                  rows={3}
                  onBlur={(e) => handleNotesChange(selected.id, e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={selected.status} onValueChange={(v) => handleStatusChange(selected.id, v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Mới</SelectItem>
                    <SelectItem value="contacted">Đã liên hệ</SelectItem>
                    <SelectItem value="done">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(selected.id)}>
                  <Trash2 className="w-4 h-4 mr-1" />Xóa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

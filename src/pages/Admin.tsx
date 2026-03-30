import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Save, ArrowLeft, Settings, Layout, MessageSquare, Phone, FileText, Type, Building2, Plus, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAllSiteContent, useUpdateSiteContent } from "@/hooks/useSiteContent";
import { Json } from "@/integrations/supabase/types";
import ImageUpload from "@/components/admin/ImageUpload";
import PropertiesAdmin from "@/components/admin/PropertiesAdmin";

type SectionData = Record<string, any>;

export default function Admin() {
  const { toast } = useToast();
  const { data: allContent, isLoading } = useAllSiteContent();
  const updateMutation = useUpdateSiteContent();
  const [sections, setSections] = useState<Record<string, SectionData>>({});

  useEffect(() => {
    if (allContent) {
      const mapped: Record<string, SectionData> = {};
      allContent.forEach((item) => {
        mapped[item.section_key] = item.content as SectionData;
      });
      setSections(mapped);
    }
  }, [allContent]);

  const updateField = (section: string, field: string, value: any) => {
    setSections((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateStatField = (section: string, index: number, field: string, value: string) => {
    setSections((prev) => {
      const stats = [...(prev[section]?.stats || [])];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, [section]: { ...prev[section], stats } };
    });
  };

  const updateArrayItem = (section: string, arrayKey: string, index: number, value: string) => {
    setSections((prev) => {
      const arr = [...(prev[section]?.[arrayKey] || [])];
      arr[index] = value;
      return { ...prev, [section]: { ...prev[section], [arrayKey]: arr } };
    });
  };

  const addArrayItem = (section: string, arrayKey: string, defaultValue: any = "") => {
    setSections((prev) => {
      const arr = [...(prev[section]?.[arrayKey] || []), defaultValue];
      return { ...prev, [section]: { ...prev[section], [arrayKey]: arr } };
    });
  };

  const removeArrayItem = (section: string, arrayKey: string, index: number) => {
    setSections((prev) => {
      const arr = [...(prev[section]?.[arrayKey] || [])];
      arr.splice(index, 1);
      return { ...prev, [section]: { ...prev[section], [arrayKey]: arr } };
    });
  };

  const updateReviewField = (index: number, field: string, value: any) => {
    setSections((prev) => {
      const reviews = [...(prev.reviews?.reviews || [])];
      reviews[index] = { ...reviews[index], [field]: value };
      return { ...prev, reviews: { ...prev.reviews, reviews } };
    });
  };

  const addReview = () => {
    setSections((prev) => {
      const reviews = [...(prev.reviews?.reviews || []), { name: "", location: "", rating: 5, content: "", project: "", avatar: "" }];
      return { ...prev, reviews: { ...prev.reviews, reviews } };
    });
  };

  const removeReview = (index: number) => {
    setSections((prev) => {
      const reviews = [...(prev.reviews?.reviews || [])];
      reviews.splice(index, 1);
      return { ...prev, reviews: { ...prev.reviews, reviews } };
    });
  };

  const updateTrustBadge = (index: number, field: string, value: string) => {
    setSections((prev) => {
      const badges = [...(prev.reviews?.trustBadges || [])];
      badges[index] = { ...badges[index], [field]: value };
      return { ...prev, reviews: { ...prev.reviews, trustBadges: badges } };
    });
  };

  const saveSection = async (sectionKey: string) => {
    try {
      await updateMutation.mutateAsync({
        sectionKey,
        content: sections[sectionKey] as unknown as Json,
      });
      toast({ title: "Đã lưu!", description: `Section "${sectionKey}" đã được cập nhật.` });
    } catch {
      toast({ title: "Lỗi!", description: "Không thể lưu. Vui lòng thử lại.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-secondary text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link to="/" className="shrink-0">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 px-2 sm:px-3">
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Về trang chủ</span>
              </Button>
            </Link>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold truncate">VSM Admin</h1>
              <p className="text-white/60 text-xs sm:text-sm hidden sm:block">Quản lý nội dung website</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs sm:text-sm text-white/80 hidden sm:inline">Đang kết nối</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Tabs defaultValue="logo" className="space-y-4 sm:space-y-8">
          <TabsList className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-1.5 sm:gap-2 h-auto bg-transparent">
            {[
              { value: "logo", icon: Settings, label: "Logo" },
              { value: "hero", icon: Layout, label: "Hero" },
              { value: "about", icon: FileText, label: "Giới thiệu" },
              { value: "properties_section", icon: Building2, label: "Section DÁ" },
              { value: "properties", icon: Building2, label: "Dự án" },
              { value: "reviews", icon: MessageSquare, label: "Đánh giá" },
              { value: "contact", icon: Phone, label: "Liên hệ" },
              { value: "footer", icon: Type, label: "Footer" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2 sm:px-4 py-2 sm:py-3 rounded-lg border border-border text-xs sm:text-sm"
              >
                <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="truncate">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Logo */}
          <TabsContent value="logo">
            <SectionCard title="Logo & Thương hiệu" icon={Settings} onSave={() => saveSection("logo")} saving={updateMutation.isPending}>
              <div className="grid gap-4 sm:gap-6">
                <FieldGroup label="Tên thương hiệu">
                  <Input value={sections.logo?.text || ""} onChange={(e) => updateField("logo", "text", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Phụ đề">
                  <Input value={sections.logo?.subtitle || ""} onChange={(e) => updateField("logo", "subtitle", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Logo (ảnh)">
                  <ImageUpload value={sections.logo?.imageUrl || ""} onChange={(url) => updateField("logo", "imageUrl", url)} label="Logo" previewClassName="h-16 w-auto object-contain" />
                </FieldGroup>
              </div>
            </SectionCard>
          </TabsContent>

          {/* Hero */}
          <TabsContent value="hero">
            <SectionCard title="Hero Banner" icon={Layout} onSave={() => saveSection("hero")} saving={updateMutation.isPending}>
              <div className="space-y-4 sm:space-y-6">
                <FieldGroup label="Tiêu đề chính">
                  <Input value={sections.hero?.title || ""} onChange={(e) => updateField("hero", "title", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Mô tả phụ">
                  <Textarea rows={3} value={sections.hero?.subtitle || ""} onChange={(e) => updateField("hero", "subtitle", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="URL Video nền (YouTube/MP4)">
                  <Input placeholder="https://youtube.com/..." value={sections.hero?.videoUrl || ""} onChange={(e) => updateField("hero", "videoUrl", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Ảnh nền (thay thế video)">
                  <ImageUpload value={sections.hero?.backgroundImage || ""} onChange={(url) => updateField("hero", "backgroundImage", url)} label="Hero background" previewClassName="h-32 w-full object-cover" />
                </FieldGroup>
              </div>
            </SectionCard>
          </TabsContent>

          {/* About */}
          <TabsContent value="about">
            <SectionCard title="Giới Thiệu Công Ty" icon={FileText} onSave={() => saveSection("about")} saving={updateMutation.isPending}>
              <div className="space-y-4 sm:space-y-6">
                <FieldGroup label="Tiêu đề">
                  <Input value={sections.about?.title || ""} onChange={(e) => updateField("about", "title", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Mô tả">
                  <Textarea rows={4} value={sections.about?.description || ""} onChange={(e) => updateField("about", "description", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Tiêu đề 'Tại sao chọn'">
                  <Input value={sections.about?.whyChooseTitle || ""} onChange={(e) => updateField("about", "whyChooseTitle", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="URL Video giới thiệu">
                  <Input placeholder="https://youtube.com/..." value={sections.about?.videoUrl || ""} onChange={(e) => updateField("about", "videoUrl", e.target.value)} />
                </FieldGroup>
                <div>
                  <label className="block text-sm font-semibold mb-3">Số liệu thống kê</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {(sections.about?.stats || []).map((stat: any, i: number) => (
                      <div key={i} className="flex gap-2 sm:gap-3 p-3 bg-muted/50 rounded-lg">
                        <Input placeholder="Giá trị" value={stat.value || ""} onChange={(e) => updateStatField("about", i, "value", e.target.value)} className="w-20 sm:w-24" />
                        <Input placeholder="Nhãn" value={stat.label || ""} onChange={(e) => updateStatField("about", i, "label", e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold">Danh sách cam kết / thành tựu</label>
                    <Button size="sm" variant="outline" onClick={() => addArrayItem("about", "achievements", "")}>
                      <Plus className="w-4 h-4 mr-1" /> Thêm
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(sections.about?.achievements || []).map((item: string, i: number) => (
                      <div key={i} className="flex gap-2">
                        <Input value={item} onChange={(e) => updateArrayItem("about", "achievements", i, e.target.value)} />
                        <Button size="icon" variant="ghost" className="shrink-0 text-destructive" onClick={() => removeArrayItem("about", "achievements", i)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* Properties Section title */}
          <TabsContent value="properties_section">
            <SectionCard title="Tiêu đề Section Dự Án" icon={Building2} onSave={() => saveSection("properties_section")} saving={updateMutation.isPending}>
              <div className="space-y-4 sm:space-y-6">
                <FieldGroup label="Tiêu đề section">
                  <Input value={sections.properties_section?.title || ""} onChange={(e) => updateField("properties_section", "title", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Mô tả phụ">
                  <Textarea rows={3} value={sections.properties_section?.subtitle || ""} onChange={(e) => updateField("properties_section", "subtitle", e.target.value)} />
                </FieldGroup>
              </div>
            </SectionCard>
          </TabsContent>

          {/* Properties CRUD */}
          <TabsContent value="properties">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <PropertiesAdmin />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews">
            <SectionCard title="Đánh Giá Khách Hàng" icon={MessageSquare} onSave={() => saveSection("reviews")} saving={updateMutation.isPending}>
              <div className="space-y-6">
                <FieldGroup label="Tiêu đề section">
                  <Input value={sections.reviews?.title || ""} onChange={(e) => updateField("reviews", "title", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Mô tả phụ">
                  <Textarea rows={2} value={sections.reviews?.subtitle || ""} onChange={(e) => updateField("reviews", "subtitle", e.target.value)} />
                </FieldGroup>

                {/* Trust Badges */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Trust Badges (số liệu nổi bật)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(sections.reviews?.trustBadges || []).map((badge: any, i: number) => (
                      <div key={i} className="flex gap-2 p-3 bg-muted/50 rounded-lg">
                        <Input placeholder="Giá trị" value={badge.value || ""} onChange={(e) => updateTrustBadge(i, "value", e.target.value)} className="w-24" />
                        <Input placeholder="Nhãn" value={badge.label || ""} onChange={(e) => updateTrustBadge(i, "label", e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold">Danh sách đánh giá</label>
                    <Button size="sm" variant="outline" onClick={addReview}>
                      <Plus className="w-4 h-4 mr-1" /> Thêm đánh giá
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {(sections.reviews?.reviews || []).map((review: any, i: number) => (
                      <Card key={i} className="border border-border">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-muted-foreground">Đánh giá #{i + 1}</span>
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => removeReview(i)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input placeholder="Tên khách hàng" value={review.name || ""} onChange={(e) => updateReviewField(i, "name", e.target.value)} />
                            <Input placeholder="Vị trí (VD: Quận 1, TP.HCM)" value={review.location || ""} onChange={(e) => updateReviewField(i, "location", e.target.value)} />
                            <Input placeholder="Dự án liên quan" value={review.project || ""} onChange={(e) => updateReviewField(i, "project", e.target.value)} />
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-primary" />
                              <Input type="number" min={1} max={5} value={review.rating || 5} onChange={(e) => updateReviewField(i, "rating", parseInt(e.target.value) || 5)} className="w-20" />
                              <span className="text-xs text-muted-foreground">sao</span>
                            </div>
                          </div>
                          <Textarea placeholder="Nội dung đánh giá..." value={review.content || ""} onChange={(e) => updateReviewField(i, "content", e.target.value)} rows={2} />
                          <ImageUpload value={review.avatar || ""} onChange={(url) => updateReviewField(i, "avatar", url)} label="Avatar" previewClassName="h-12 w-12 rounded-full object-cover" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* Contact */}
          <TabsContent value="contact">
            <SectionCard title="Thông Tin Liên Hệ" icon={Phone} onSave={() => saveSection("contact")} saving={updateMutation.isPending}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <FieldGroup label="Tiêu đề">
                    <Input value={sections.contact?.title || ""} onChange={(e) => updateField("contact", "title", e.target.value)} />
                  </FieldGroup>
                  <FieldGroup label="Mô tả phụ">
                    <Input value={sections.contact?.subtitle || ""} onChange={(e) => updateField("contact", "subtitle", e.target.value)} />
                  </FieldGroup>
                  <FieldGroup label="Số điện thoại">
                    <Input value={sections.contact?.phone || ""} onChange={(e) => updateField("contact", "phone", e.target.value)} />
                  </FieldGroup>
                  <FieldGroup label="Email">
                    <Input value={sections.contact?.email || ""} onChange={(e) => updateField("contact", "email", e.target.value)} />
                  </FieldGroup>
                  <FieldGroup label="Địa chỉ" className="sm:col-span-2">
                    <Input value={sections.contact?.address || ""} onChange={(e) => updateField("contact", "address", e.target.value)} />
                  </FieldGroup>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold">Danh sách dịch vụ (form liên hệ)</label>
                    <Button size="sm" variant="outline" onClick={() => addArrayItem("contact", "services", "")}>
                      <Plus className="w-4 h-4 mr-1" /> Thêm
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(sections.contact?.services || []).map((service: string, i: number) => (
                      <div key={i} className="flex gap-2">
                        <Input value={service} onChange={(e) => updateArrayItem("contact", "services", i, e.target.value)} />
                        <Button size="icon" variant="ghost" className="shrink-0 text-destructive" onClick={() => removeArrayItem("contact", "services", i)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* Footer */}
          <TabsContent value="footer">
            <SectionCard title="Footer" icon={Type} onSave={() => saveSection("footer")} saving={updateMutation.isPending}>
              <div className="space-y-4 sm:space-y-6">
                <FieldGroup label="Tên công ty">
                  <Input value={sections.footer?.companyName || ""} onChange={(e) => updateField("footer", "companyName", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Mô tả">
                  <Textarea rows={2} value={sections.footer?.description || ""} onChange={(e) => updateField("footer", "description", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Copyright">
                  <Input value={sections.footer?.copyright || ""} onChange={(e) => updateField("footer", "copyright", e.target.value)} />
                </FieldGroup>
              </div>
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children, onSave, saving }: {
  title: string; icon: any; children: React.ReactNode; onSave: () => void; saving: boolean;
}) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-4">
        <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          {title}
        </CardTitle>
        <Button onClick={onSave} disabled={saving} className="btn-primary w-full sm:w-auto">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6">{children}</CardContent>
    </Card>
  );
}

function FieldGroup({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-muted-foreground mb-2">{label}</label>
      {children}
    </div>
  );
}

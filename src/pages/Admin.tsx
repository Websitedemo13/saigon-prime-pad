import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Save, ArrowLeft, Image, Type, Video, Settings, Layout, MessageSquare, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAllSiteContent, useUpdateSiteContent } from "@/hooks/useSiteContent";
import { Json } from "@/integrations/supabase/types";

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
      {/* Admin Header */}
      <header className="bg-secondary text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" /> Về trang chủ
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">VSM Admin Panel</h1>
              <p className="text-white/60 text-sm">Quản lý nội dung website</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-white/80">Đang kết nối</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="logo" className="space-y-8">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 h-auto bg-transparent">
            {[
              { value: "logo", icon: Settings, label: "Logo" },
              { value: "hero", icon: Layout, label: "Hero" },
              { value: "about", icon: FileText, label: "Giới thiệu" },
              { value: "reviews", icon: MessageSquare, label: "Đánh giá" },
              { value: "contact", icon: Phone, label: "Liên hệ" },
              { value: "footer", icon: Type, label: "Footer" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-3 rounded-lg border border-border"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Logo Section */}
          <TabsContent value="logo">
            <SectionCard title="Logo & Thương hiệu" icon={Settings} onSave={() => saveSection("logo")} saving={updateMutation.isPending}>
              <div className="grid md:grid-cols-2 gap-6">
                <FieldGroup label="Tên thương hiệu">
                  <Input value={sections.logo?.text || ""} onChange={(e) => updateField("logo", "text", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Phụ đề">
                  <Input value={sections.logo?.subtitle || ""} onChange={(e) => updateField("logo", "subtitle", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="URL Logo (ảnh)" className="md:col-span-2">
                  <Input placeholder="https://example.com/logo.png" value={sections.logo?.imageUrl || ""} onChange={(e) => updateField("logo", "imageUrl", e.target.value)} />
                  {sections.logo?.imageUrl && (
                    <img src={sections.logo.imageUrl} alt="Logo preview" className="mt-3 h-16 object-contain rounded border border-border p-2" />
                  )}
                </FieldGroup>
              </div>
            </SectionCard>
          </TabsContent>

          {/* Hero Section */}
          <TabsContent value="hero">
            <SectionCard title="Hero Banner" icon={Layout} onSave={() => saveSection("hero")} saving={updateMutation.isPending}>
              <div className="space-y-6">
                <FieldGroup label="Tiêu đề chính">
                  <Input value={sections.hero?.title || ""} onChange={(e) => updateField("hero", "title", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Mô tả phụ">
                  <Textarea rows={3} value={sections.hero?.subtitle || ""} onChange={(e) => updateField("hero", "subtitle", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="URL Video nền (YouTube/MP4)">
                  <Input placeholder="https://youtube.com/... hoặc https://example.com/video.mp4" value={sections.hero?.videoUrl || ""} onChange={(e) => updateField("hero", "videoUrl", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="URL Ảnh nền (thay thế video)">
                  <Input placeholder="https://example.com/hero.jpg" value={sections.hero?.backgroundImage || ""} onChange={(e) => updateField("hero", "backgroundImage", e.target.value)} />
                  {sections.hero?.backgroundImage && (
                    <img src={sections.hero.backgroundImage} alt="Hero preview" className="mt-3 h-32 w-full object-cover rounded border border-border" />
                  )}
                </FieldGroup>
              </div>
            </SectionCard>
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about">
            <SectionCard title="Giới Thiệu Công Ty" icon={FileText} onSave={() => saveSection("about")} saving={updateMutation.isPending}>
              <div className="space-y-6">
                <FieldGroup label="Tiêu đề">
                  <Input value={sections.about?.title || ""} onChange={(e) => updateField("about", "title", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Mô tả">
                  <Textarea rows={4} value={sections.about?.description || ""} onChange={(e) => updateField("about", "description", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="URL Video giới thiệu">
                  <Input placeholder="https://youtube.com/..." value={sections.about?.videoUrl || ""} onChange={(e) => updateField("about", "videoUrl", e.target.value)} />
                </FieldGroup>

                <div>
                  <label className="block text-sm font-semibold mb-3">Số liệu thống kê</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(sections.about?.stats || []).map((stat: any, i: number) => (
                      <div key={i} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                        <Input placeholder="Giá trị" value={stat.value || ""} onChange={(e) => updateStatField("about", i, "value", e.target.value)} className="w-24" />
                        <Input placeholder="Nhãn" value={stat.label || ""} onChange={(e) => updateStatField("about", i, "label", e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* Reviews Section */}
          <TabsContent value="reviews">
            <SectionCard title="Đánh Giá Khách Hàng" icon={MessageSquare} onSave={() => saveSection("reviews")} saving={updateMutation.isPending}>
              <div className="space-y-6">
                <FieldGroup label="Tiêu đề section">
                  <Input value={sections.reviews?.title || ""} onChange={(e) => updateField("reviews", "title", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Mô tả phụ">
                  <Textarea rows={2} value={sections.reviews?.subtitle || ""} onChange={(e) => updateField("reviews", "subtitle", e.target.value)} />
                </FieldGroup>
              </div>
            </SectionCard>
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact">
            <SectionCard title="Thông Tin Liên Hệ" icon={Phone} onSave={() => saveSection("contact")} saving={updateMutation.isPending}>
              <div className="grid md:grid-cols-2 gap-6">
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
                <FieldGroup label="Địa chỉ" className="md:col-span-2">
                  <Input value={sections.contact?.address || ""} onChange={(e) => updateField("contact", "address", e.target.value)} />
                </FieldGroup>
              </div>
            </SectionCard>
          </TabsContent>

          {/* Footer Section */}
          <TabsContent value="footer">
            <SectionCard title="Footer" icon={Type} onSave={() => saveSection("footer")} saving={updateMutation.isPending}>
              <div className="space-y-6">
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

/* --- Reusable sub-components --- */

function SectionCard({ title, icon: Icon, children, onSave, saving }: {
  title: string; icon: any; children: React.ReactNode; onSave: () => void; saving: boolean;
}) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          {title}
        </CardTitle>
        <Button onClick={onSave} disabled={saving} className="btn-primary">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
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

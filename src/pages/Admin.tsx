import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Save, ArrowLeft, Settings, Layout, MessageSquare, Phone, FileText, Type,
  Building2, Plus, Trash2, Star, Globe, Image as ImageIcon, Video, Menu,
  Facebook, Instagram, Youtube, Linkedin, Link as LinkIcon, GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAllSiteContent, useUpdateSiteContent } from "@/hooks/useSiteContent";
import { Json } from "@/integrations/supabase/types";
import ImageUpload from "@/components/admin/ImageUpload";
import VideoUpload from "@/components/admin/VideoUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import PropertiesAdmin from "@/components/admin/PropertiesAdmin";
import PageBuilder from "@/components/admin/PageBuilder";
import ContactSubmissionsAdmin from "@/components/admin/ContactSubmissionsAdmin";
import { AdminThemeSwitcher, useAdminTheme } from "@/components/admin/AdminThemeSwitcher";

type SectionData = Record<string, any>;

export default function Admin() {
  const { toast } = useToast();
  const { data: allContent, isLoading } = useAllSiteContent();
  const updateMutation = useUpdateSiteContent();
  const [sections, setSections] = useState<Record<string, SectionData>>({});
  useAdminTheme();

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

  const updateNestedField = (section: string, parent: string, field: string, value: any) => {
    setSections((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: { ...(prev[section]?.[parent] || {}), [field]: value },
      },
    }));
  };

  const updateStatField = (section: string, index: number, field: string, value: string) => {
    setSections((prev) => {
      const stats = [...(prev[section]?.stats || [])];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, [section]: { ...prev[section], stats } };
    });
  };

  const updateArrayItem = (section: string, arrayKey: string, index: number, value: any) => {
    setSections((prev) => {
      const arr = [...(prev[section]?.[arrayKey] || [])];
      arr[index] = value;
      return { ...prev, [section]: { ...prev[section], [arrayKey]: arr } };
    });
  };

  const updateArrayObjectField = (section: string, arrayKey: string, index: number, field: string, value: string) => {
    setSections((prev) => {
      const arr = [...(prev[section]?.[arrayKey] || [])];
      arr[index] = { ...arr[index], [field]: value };
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
        <Tabs defaultValue="page_builder" className="space-y-4 sm:space-y-8">
          <TabsList className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-11 gap-1.5 sm:gap-2 h-auto bg-transparent">
            {[
              { value: "page_builder", icon: Layout, label: "Bố cục" },
              { value: "submissions", icon: MessageSquare, label: "Form LH" },
              { value: "header", icon: Menu, label: "Header" },
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

          {/* ============ PAGE BUILDER ============ */}
          <TabsContent value="page_builder">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <PageBuilder />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ============ CONTACT SUBMISSIONS ============ */}
          <TabsContent value="submissions">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  Quản Lý Form Liên Hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ContactSubmissionsAdmin />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ============ HEADER ============ */}
          <TabsContent value="header">
            <SectionCard title="Header / Điều hướng" icon={Menu} onSave={() => saveSection("header")} saving={updateMutation.isPending}>
              <div className="space-y-6">
                <FieldGroup label="Số điện thoại hiển thị trên header">
                  <Input value={sections.header?.phone || ""} onChange={(e) => updateField("header", "phone", e.target.value)} placeholder="0123.456.789" />
                </FieldGroup>
                <FieldGroup label="Nút CTA (text)">
                  <Input value={sections.header?.ctaText || ""} onChange={(e) => updateField("header", "ctaText", e.target.value)} placeholder="Tư Vấn Ngay" />
                </FieldGroup>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold">Menu điều hướng</label>
                    <Button size="sm" variant="outline" onClick={() => addArrayItem("header", "navLinks", { label: "", href: "#" })}>
                      <Plus className="w-4 h-4 mr-1" /> Thêm link
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(sections.header?.navLinks || []).map((link: any, i: number) => (
                      <div key={i} className="flex gap-2 items-center p-3 bg-muted/50 rounded-lg">
                        <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                        <Input placeholder="Tên hiển thị" value={link.label || ""} onChange={(e) => updateArrayObjectField("header", "navLinks", i, "label", e.target.value)} className="flex-1" />
                        <Input placeholder="#section-id" value={link.href || ""} onChange={(e) => updateArrayObjectField("header", "navLinks", i, "href", e.target.value)} className="w-32 sm:w-40" />
                        <Button size="icon" variant="ghost" className="shrink-0 text-destructive" onClick={() => removeArrayItem("header", "navLinks", i)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* ============ LOGO ============ */}
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
                <FieldGroup label="Favicon">
                  <ImageUpload value={sections.logo?.favicon || ""} onChange={(url) => updateField("logo", "favicon", url)} label="Favicon" previewClassName="h-10 w-10 object-contain" />
                </FieldGroup>
              </div>
            </SectionCard>
          </TabsContent>

          {/* ============ HERO ============ */}
          <TabsContent value="hero">
            <SectionCard title="Hero Banner" icon={Layout} onSave={() => saveSection("hero")} saving={updateMutation.isPending}>
              <div className="space-y-6">
                <FieldGroup label="Tiêu đề chính">
                  <Input value={sections.hero?.title || ""} onChange={(e) => updateField("hero", "title", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Mô tả phụ">
                  <RichTextEditor value={sections.hero?.subtitle || ""} onChange={(html) => updateField("hero", "subtitle", html)} minHeight="100px" />
                </FieldGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="Nút CTA chính (text)">
                    <Input value={sections.hero?.ctaPrimary || ""} onChange={(e) => updateField("hero", "ctaPrimary", e.target.value)} placeholder="Tư Vấn Miễn Phí" />
                  </FieldGroup>
                  <FieldGroup label="Nút CTA phụ (text)">
                    <Input value={sections.hero?.ctaSecondary || ""} onChange={(e) => updateField("hero", "ctaSecondary", e.target.value)} placeholder="Xem Dự Án" />
                  </FieldGroup>
                </div>
                <FieldGroup label="Video nền (YouTube/MP4)">
                  <VideoUpload value={sections.hero?.videoUrl || ""} onChange={(url) => updateField("hero", "videoUrl", url)} />
                </FieldGroup>
                <FieldGroup label="Ảnh nền (thay thế video)">
                  <ImageUpload value={sections.hero?.backgroundImage || ""} onChange={(url) => updateField("hero", "backgroundImage", url)} label="Hero background" previewClassName="h-40 w-full object-cover" />
                </FieldGroup>
                <FieldGroup label="Ảnh overlay / Badge (góc)">
                  <ImageUpload value={sections.hero?.overlayImage || ""} onChange={(url) => updateField("hero", "overlayImage", url)} label="Overlay" previewClassName="h-20 w-20 object-contain" />
                </FieldGroup>
              </div>
            </SectionCard>
          </TabsContent>

          {/* ============ ABOUT ============ */}
          <TabsContent value="about">
            <SectionCard title="Giới Thiệu Công Ty" icon={FileText} onSave={() => saveSection("about")} saving={updateMutation.isPending}>
              <div className="space-y-6">
                <FieldGroup label="Tiêu đề">
                  <Input value={sections.about?.title || ""} onChange={(e) => updateField("about", "title", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Nội dung mô tả (Rich text)">
                  <RichTextEditor value={sections.about?.description || ""} onChange={(html) => updateField("about", "description", html)} minHeight="150px" />
                </FieldGroup>
                <FieldGroup label="Nội dung 'Cam kết' (Rich text)">
                  <RichTextEditor value={sections.about?.commitmentContent || ""} onChange={(html) => updateField("about", "commitmentContent", html)} minHeight="120px" />
                </FieldGroup>
                <FieldGroup label="Tiêu đề 'Tại sao chọn'">
                  <Input value={sections.about?.whyChooseTitle || ""} onChange={(e) => updateField("about", "whyChooseTitle", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Ảnh bìa section">
                  <ImageUpload value={sections.about?.coverImage || ""} onChange={(url) => updateField("about", "coverImage", url)} label="About cover" previewClassName="h-40 w-full object-cover" />
                </FieldGroup>
                <FieldGroup label="Video giới thiệu">
                  <VideoUpload value={sections.about?.videoUrl || ""} onChange={(url) => updateField("about", "videoUrl", url)} />
                </FieldGroup>
                <div>
                  <label className="block text-sm font-semibold mb-3">Số liệu thống kê</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {(sections.about?.stats || []).map((stat: any, i: number) => (
                      <div key={i} className="flex gap-2 sm:gap-3 p-3 bg-muted/50 rounded-lg items-center">
                        <Input placeholder="Giá trị" value={stat.value || ""} onChange={(e) => updateStatField("about", i, "value", e.target.value)} className="w-20 sm:w-24" />
                        <Input placeholder="Nhãn" value={stat.label || ""} onChange={(e) => updateStatField("about", i, "label", e.target.value)} />
                        <Input placeholder="Icon (tên)" value={stat.icon || ""} onChange={(e) => updateStatField("about", i, "icon", e.target.value)} className="w-24" />
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

          {/* ============ PROPERTIES SECTION ============ */}
          <TabsContent value="properties_section">
            <SectionCard title="Tiêu đề Section Dự Án" icon={Building2} onSave={() => saveSection("properties_section")} saving={updateMutation.isPending}>
              <div className="space-y-6">
                <FieldGroup label="Tiêu đề section">
                  <Input value={sections.properties_section?.title || ""} onChange={(e) => updateField("properties_section", "title", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Mô tả phụ">
                  <RichTextEditor value={sections.properties_section?.subtitle || ""} onChange={(html) => updateField("properties_section", "subtitle", html)} minHeight="80px" />
                </FieldGroup>
                <FieldGroup label="Ảnh bìa section">
                  <ImageUpload value={sections.properties_section?.coverImage || ""} onChange={(url) => updateField("properties_section", "coverImage", url)} label="Properties cover" previewClassName="h-32 w-full object-cover" />
                </FieldGroup>
              </div>
            </SectionCard>
          </TabsContent>

          {/* ============ PROPERTIES CRUD ============ */}
          <TabsContent value="properties">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <PropertiesAdmin />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ============ REVIEWS ============ */}
          <TabsContent value="reviews">
            <SectionCard title="Đánh Giá Khách Hàng" icon={MessageSquare} onSave={() => saveSection("reviews")} saving={updateMutation.isPending}>
              <div className="space-y-6">
                <FieldGroup label="Tiêu đề section">
                  <Input value={sections.reviews?.title || ""} onChange={(e) => updateField("reviews", "title", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Mô tả phụ">
                  <Textarea rows={2} value={sections.reviews?.subtitle || ""} onChange={(e) => updateField("reviews", "subtitle", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Ảnh bìa section">
                  <ImageUpload value={sections.reviews?.coverImage || ""} onChange={(url) => updateField("reviews", "coverImage", url)} label="Reviews cover" previewClassName="h-32 w-full object-cover" />
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
                            <Input placeholder="Vị trí" value={review.location || ""} onChange={(e) => updateReviewField(i, "location", e.target.value)} />
                            <Input placeholder="Dự án liên quan" value={review.project || ""} onChange={(e) => updateReviewField(i, "project", e.target.value)} />
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-primary" />
                              <Input type="number" min={1} max={5} value={review.rating || 5} onChange={(e) => updateReviewField(i, "rating", parseInt(e.target.value) || 5)} className="w-20" />
                            </div>
                          </div>
                          <FieldGroup label="Nội dung đánh giá">
                            <Textarea placeholder="Nội dung đánh giá..." value={review.content || ""} onChange={(e) => updateReviewField(i, "content", e.target.value)} rows={2} />
                          </FieldGroup>
                          <FieldGroup label="Avatar">
                            <ImageUpload value={review.avatar || ""} onChange={(url) => updateReviewField(i, "avatar", url)} label="Avatar" previewClassName="h-12 w-12 rounded-full object-cover" />
                          </FieldGroup>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* ============ CONTACT ============ */}
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
                  <FieldGroup label="Giờ làm việc (ngày thường)">
                    <Input value={sections.contact?.workHours || ""} onChange={(e) => updateField("contact", "workHours", e.target.value)} placeholder="Thứ 2 - Thứ 6: 8:00 - 18:00" />
                  </FieldGroup>
                  <FieldGroup label="Giờ làm việc (cuối tuần)">
                    <Input value={sections.contact?.weekendHours || ""} onChange={(e) => updateField("contact", "weekendHours", e.target.value)} placeholder="Thứ 7 - CN: 8:00 - 17:00" />
                  </FieldGroup>
                </div>
                <FieldGroup label="Ảnh bìa section liên hệ">
                  <ImageUpload value={sections.contact?.coverImage || ""} onChange={(url) => updateField("contact", "coverImage", url)} label="Contact cover" previewClassName="h-32 w-full object-cover" />
                </FieldGroup>

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

          {/* ============ FOOTER ============ */}
          <TabsContent value="footer">
            <SectionCard title="Footer" icon={Type} onSave={() => saveSection("footer")} saving={updateMutation.isPending}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <FieldGroup label="Tên công ty">
                    <Input value={sections.footer?.companyName || ""} onChange={(e) => updateField("footer", "companyName", e.target.value)} />
                  </FieldGroup>
                  <FieldGroup label="Giấy phép kinh doanh">
                    <Input value={sections.footer?.businessLicense || ""} onChange={(e) => updateField("footer", "businessLicense", e.target.value)} placeholder="0123456789" />
                  </FieldGroup>
                </div>
                <FieldGroup label="Mô tả công ty">
                  <RichTextEditor value={sections.footer?.description || ""} onChange={(html) => updateField("footer", "description", html)} minHeight="100px" />
                </FieldGroup>
                <FieldGroup label="Copyright">
                  <Input value={sections.footer?.copyright || ""} onChange={(e) => updateField("footer", "copyright", e.target.value)} />
                </FieldGroup>

                {/* Social Media */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Mạng xã hội</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: "facebook", icon: Facebook, label: "Facebook URL" },
                      { key: "instagram", icon: Instagram, label: "Instagram URL" },
                      { key: "youtube", icon: Youtube, label: "YouTube URL" },
                      { key: "linkedin", icon: Linkedin, label: "LinkedIn URL" },
                      { key: "tiktok", icon: Globe, label: "TikTok URL" },
                      { key: "zalo", icon: Phone, label: "Zalo URL/SĐT" },
                    ].map((social) => (
                      <div key={social.key} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <social.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <Input
                          placeholder={social.label}
                          value={sections.footer?.social?.[social.key] || ""}
                          onChange={(e) => updateNestedField("footer", "social", social.key, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold">Danh sách dịch vụ (footer)</label>
                    <Button size="sm" variant="outline" onClick={() => addArrayItem("footer", "services", "")}>
                      <Plus className="w-4 h-4 mr-1" /> Thêm
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(sections.footer?.services || []).map((item: string, i: number) => (
                      <div key={i} className="flex gap-2">
                        <Input value={item} onChange={(e) => updateArrayItem("footer", "services", i, e.target.value)} />
                        <Button size="icon" variant="ghost" className="shrink-0 text-destructive" onClick={() => removeArrayItem("footer", "services", i)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Areas List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold">Khu vực hoạt động</label>
                    <Button size="sm" variant="outline" onClick={() => addArrayItem("footer", "areas", "")}>
                      <Plus className="w-4 h-4 mr-1" /> Thêm
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(sections.footer?.areas || []).map((item: string, i: number) => (
                      <div key={i} className="flex gap-2">
                        <Input value={item} onChange={(e) => updateArrayItem("footer", "areas", i, e.target.value)} />
                        <Button size="icon" variant="ghost" className="shrink-0 text-destructive" onClick={() => removeArrayItem("footer", "areas", i)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legal Links */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold">Liên kết pháp lý</label>
                    <Button size="sm" variant="outline" onClick={() => addArrayItem("footer", "legalLinks", { label: "", url: "#" })}>
                      <Plus className="w-4 h-4 mr-1" /> Thêm
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(sections.footer?.legalLinks || []).map((item: any, i: number) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Input placeholder="Tên" value={typeof item === "string" ? item : item.label || ""} onChange={(e) => updateArrayObjectField("footer", "legalLinks", i, "label", e.target.value)} />
                        <Input placeholder="URL" value={typeof item === "string" ? "#" : item.url || ""} onChange={(e) => updateArrayObjectField("footer", "legalLinks", i, "url", e.target.value)} className="w-40" />
                        <Button size="icon" variant="ghost" className="shrink-0 text-destructive" onClick={() => removeArrayItem("footer", "legalLinks", i)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
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

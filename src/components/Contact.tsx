import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Sparkles, ArrowRight, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useCreateContactSubmission } from "@/hooks/useContactSubmissions";
import ScrollReveal from "@/components/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

export interface FormFieldConfig {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  placeholder: string;
  required: boolean;
  options?: string[]; // for select type
  dbField: string; // maps to contact_submissions column or stored in message
}

const defaultFormFields: FormFieldConfig[] = [
  { id: "name", label: "Họ và tên", type: "text", placeholder: "Nhập họ tên của bạn", required: true, dbField: "name" },
  { id: "phone", label: "Số điện thoại", type: "tel", placeholder: "0123 456 789", required: true, dbField: "phone" },
  { id: "email", label: "Email", type: "email", placeholder: "your@email.com", required: false, dbField: "email" },
  { id: "service", label: "Dịch vụ quan tâm", type: "select", placeholder: "Chọn dịch vụ bạn quan tâm", required: false, dbField: "service", options: [] },
  { id: "message", label: "Tin nhắn", type: "textarea", placeholder: "Mô tả chi tiết nhu cầu của bạn...", required: false, dbField: "message" },
];

const defaultServices = [
  "Tư vấn mua bán bất động sản",
  "Đầu tư và phát triển dự án",
  "Định giá và thẩm định",
  "Hỗ trợ pháp lý",
  "Tư vấn vay vốn ngân hàng",
  "Quản lý tài sản"
];

export default function Contact() {
  const { toast } = useToast();
  const { data: contactContent } = useSiteContent("contact");
  const { data: aboutContent } = useSiteContent("about");
  const content = contactContent?.content as Record<string, any> | null;
  const about = aboutContent?.content as Record<string, any> | null;

  const createSubmission = useCreateContactSubmission();
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Get form fields from admin config or use defaults
  const formFields: FormFieldConfig[] = content?.formFields?.length 
    ? content.formFields 
    : defaultFormFields;

  const services: string[] = content?.services?.length ? content.services : defaultServices;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Map form values to DB columns
      const dbData: Record<string, string> = { name: "", phone: "" };
      const extraFields: string[] = [];
      
      formFields.forEach(field => {
        const val = (formValues[field.id] || "").trim();
        if (["name", "phone", "email", "service", "message"].includes(field.dbField)) {
          dbData[field.dbField] = val;
        } else if (val) {
          extraFields.push(`${field.label}: ${val}`);
        }
      });

      // Append extra fields to message
      if (extraFields.length) {
        dbData.message = [dbData.message, ...extraFields].filter(Boolean).join("\n---\n");
      }

      await createSubmission.mutateAsync({
        name: dbData.name,
        phone: dbData.phone,
        email: dbData.email || undefined,
        service: dbData.service || undefined,
        message: dbData.message || undefined,
      });
      
      setSubmitted(true);
      setFormValues({});
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      toast({ title: "Lỗi!", description: "Không thể gửi. Vui lòng thử lại.", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const handleChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const phoneNum = content?.phone || "0123.456.789";
  const emailAddr = content?.email || "info@vsm-realestate.com";
  const address = content?.address || "123 Nguyễn Huệ, Quận 1, TP.HCM";

  const sidebarStats = about?.stats?.length
    ? about.stats.map((s: any) => ({ value: s.value, label: s.label }))
    : [
        { value: "15+", label: "Năm kinh nghiệm" },
        { value: "500+", label: "Dự án thành công" },
        { value: "10K+", label: "Khách hàng" },
        { value: "95%", label: "Hài lòng" },
      ];

  const renderField = (field: FormFieldConfig) => {
    const isFocused = focusedField === field.id;
    const fieldOptions = field.type === "select" && field.dbField === "service" 
      ? (field.options?.length ? field.options : services)
      : field.options || [];

    return (
      <motion.div
        key={field.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${isFocused ? 'text-primary' : 'text-foreground'}`}>
          {field.label} {field.required && <span className="text-primary">*</span>}
        </label>
        <div className={`relative rounded-xl transition-all duration-300 ${isFocused ? 'ring-2 ring-primary/30 shadow-lg shadow-primary/10' : ''}`}>
          {field.type === "textarea" ? (
            <Textarea
              placeholder={field.placeholder}
              value={formValues[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onFocus={() => setFocusedField(field.id)}
              onBlur={() => setFocusedField(null)}
              rows={4}
              required={field.required}
              className="resize-none rounded-xl border-border/50 bg-background/80 backdrop-blur-sm hover:border-primary/30 transition-all"
            />
          ) : field.type === "select" ? (
            <Select
              value={formValues[field.id] || ""}
              onValueChange={(value) => handleChange(field.id, value)}
            >
              <SelectTrigger 
                className="h-12 rounded-xl border-border/50 bg-background/80 backdrop-blur-sm hover:border-primary/30 transition-all"
                onFocus={() => setFocusedField(field.id)}
                onBlur={() => setFocusedField(null)}
              >
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {fieldOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type={field.type}
              placeholder={field.placeholder}
              value={formValues[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onFocus={() => setFocusedField(field.id)}
              onBlur={() => setFocusedField(null)}
              required={field.required}
              className="h-12 rounded-xl border-border/50 bg-background/80 backdrop-blur-sm hover:border-primary/30 transition-all"
            />
          )}
        </div>
      </motion.div>
    );
  };

  // Group fields: put text/tel/email side by side in pairs
  const renderFormFields = () => {
    const groups: FormFieldConfig[][] = [];
    let currentPair: FormFieldConfig[] = [];

    formFields.forEach(field => {
      if (field.type === "textarea" || field.type === "select") {
        if (currentPair.length) { groups.push([...currentPair]); currentPair = []; }
        groups.push([field]);
      } else {
        currentPair.push(field);
        if (currentPair.length === 2) { groups.push([...currentPair]); currentPair = []; }
      }
    });
    if (currentPair.length) groups.push(currentPair);

    return groups.map((group, i) => (
      <div key={i} className={group.length === 2 ? "grid md:grid-cols-2 gap-4" : ""}>
        {group.map(field => renderField(field))}
      </div>
    ));
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Liên hệ tư vấn miễn phí
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {content?.title || "Liên Hệ Với Chúng Tôi"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {content?.subtitle || "Đừng chần chừ, hãy để VSM Real Estate đồng hành cùng bạn"}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <ScrollReveal direction="left">
            <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-xl relative overflow-hidden">
              {/* Card decorative gradient */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-secondary" />
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6"
                      >
                        <CheckCircle className="w-10 h-10 text-green-500" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-3">Gửi Thành Công! 🎉</h3>
                      <p className="text-muted-foreground max-w-sm">
                        Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div key="form">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                          <MessageCircle className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">Đăng Ký Tư Vấn</h3>
                          <p className="text-sm text-muted-foreground">Miễn phí • Nhanh chóng</p>
                        </div>
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-5">
                        {renderFormFields()}
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                          <Button
                            type="submit"
                            className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all duration-300"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2" />Đang gửi...</>
                            ) : (
                              <><Send className="w-5 h-5 mr-2" />Gửi Thông Tin<ArrowRight className="w-5 h-5 ml-2" /></>
                            )}
                          </Button>
                        </motion.div>
                      </form>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-4 h-4 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Cam kết bảo mật</span> — Thông tin của bạn được bảo vệ 100%
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.15}>
            <div className="space-y-6">
              {/* Contact Info Card */}
              <Card className="border-0 bg-gradient-to-br from-secondary to-secondary/90 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardContent className="p-8 relative z-10">
                  <h3 className="text-2xl font-bold text-secondary-foreground mb-8 flex items-center gap-3">
                    <Phone className="w-6 h-6" />
                    Thông Tin Liên Hệ
                  </h3>
                  <div className="space-y-6">
                    <ContactItem icon={Phone} title="Hotline" main={phoneNum} sub="Tư vấn 24/7 miễn phí" />
                    <ContactItem icon={Mail} title="Email" main={emailAddr} sub="Phản hồi trong 2 giờ" />
                    <ContactItem icon={MapPin} title="Địa chỉ" main={address} />
                    <ContactItem icon={Clock} title="Giờ làm việc" main={content?.workHours || "Thứ 2 - Thứ 6: 8:00 - 18:00"} sub={content?.weekendHours || "Thứ 7 - CN: 8:00 - 17:00"} />
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                <CardContent className="p-6">
                  <h4 className="font-bold text-lg mb-5 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Tại sao chọn VSM?
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {sidebarStats.map((s: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="text-center p-4 rounded-xl bg-gradient-to-b from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-all"
                      >
                        <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{s.value}</div>
                        <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon: Icon, title, main, sub }: { icon: any; title: string; main: string; sub?: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="w-12 h-12 bg-white/10 group-hover:bg-white/20 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300">
        <Icon className="w-5 h-5 text-secondary-foreground" />
      </div>
      <div>
        <h4 className="font-semibold text-secondary-foreground/80 text-sm uppercase tracking-wide mb-1">{title}</h4>
        <p className="text-secondary-foreground font-medium">{main}</p>
        {sub && <p className="text-secondary-foreground/70 text-sm mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const services = [
  "Tư vấn mua bán bất động sản",
  "Đầu tư và phát triển dự án",
  "Định giá và thẩm định",
  "Hỗ trợ pháp lý",
  "Tư vấn vay vốn ngân hàng",
  "Quản lý tài sản"
];

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Gửi thành công!",
      description: "Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.",
    });

    setFormData({
      name: "",
      phone: "",
      email: "",
      service: "",
      message: ""
    });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Liên Hệ Với Chúng Tôi
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Đừng chần chừ, hãy để VSM Real Estate đồng hành cùng bạn 
            trong hành trình đầu tư bất động sản thành công
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="border-0 shadow-luxury animate-scale-in">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Đăng Ký Tư Vấn Miễn Phí</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Họ và tên *
                    </label>
                    <Input
                      required
                      placeholder="Nhập họ tên của bạn"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Số điện thoại *
                    </label>
                    <Input
                      required
                      type="tel"
                      placeholder="0123 456 789"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dịch vụ quan tâm
                  </label>
                  <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Chọn dịch vụ bạn quan tâm" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tin nhắn
                  </label>
                  <Textarea
                    placeholder="Mô tả chi tiết nhu cầu của bạn..."
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="btn-primary w-full h-12 text-lg font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Gửi Thông Tin
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <CheckCircle className="w-5 h-5" />
                  Cam kết bảo mật thông tin khách hàng 100%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6 animate-slide-in-right">
            <Card className="border-0 bg-gradient-secondary shadow-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-secondary-foreground mb-6">
                  Thông Tin Liên Hệ
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary-foreground mb-1">Hotline</h4>
                      <p className="text-primary-light text-lg font-bold">0123.456.789</p>
                      <p className="text-secondary-foreground/80 text-sm">Tư vấn 24/7 miễn phí</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary-foreground mb-1">Email</h4>
                      <p className="text-secondary-foreground">info@vsm-realestate.com</p>
                      <p className="text-secondary-foreground/80 text-sm">Phản hồi trong 2 giờ</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary-foreground mb-1">Địa chỉ</h4>
                      <p className="text-secondary-foreground">
                        123 Nguyễn Huệ, Quận 1<br />
                        TP. Hồ Chí Minh, Việt Nam
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary-foreground mb-1">Giờ làm việc</h4>
                      <p className="text-secondary-foreground">
                        Thứ 2 - Thứ 6: 8:00 - 18:00<br />
                        Thứ 7 - CN: 8:00 - 17:00
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 bg-gradient-card shadow-card">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4">Tại sao chọn VSM?</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">15+</div>
                    <div className="text-sm text-muted-foreground">Năm kinh nghiệm</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Dự án thành công</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">10K+</div>
                    <div className="text-sm text-muted-foreground">Khách hàng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">95%</div>
                    <div className="text-sm text-muted-foreground">Hài lòng</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
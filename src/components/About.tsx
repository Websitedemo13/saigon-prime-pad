import { Building2, Users, Award, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { icon: Building2, number: "500+", label: "Dự án thành công" },
  { icon: Users, number: "10,000+", label: "Khách hàng tin tưởng" },
  { icon: Award, number: "15+", label: "Năm kinh nghiệm" },
  { icon: TrendingUp, number: "95%", label: "Tỷ lệ hài lòng" },
];

const achievements = [
  "Đối tác chiến lược của các chủ đầu tư hàng đầu",
  "Đội ngũ tư vấn chuyên nghiệp và giàu kinh nghiệm",
  "Hệ thống pháp lý minh bạch, uy tín",
  "Cam kết lợi nhuận đầu tư hấp dẫn",
  "Hỗ trợ vay vốn ngân hàng lên đến 80%",
  "Dịch vụ chăm sóc khách hàng 24/7"
];

export default function About() {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Về VSM Real Estate
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Với hơn 15 năm kinh nghiệm trong lĩnh vực bất động sản, VSM Real Estate tự hào là 
            đối tác tin cậy của hàng nghìn khách hàng trong việc đầu tư và sở hữu những 
            bất động sản có giá trị tại Hồ Chí Minh.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="card-hover border-0 bg-gradient-card animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* About Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h3 className="text-3xl font-bold mb-6 text-primary">
              Tại sao chọn VSM Real Estate?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Chúng tôi không chỉ là một công ty môi giới, mà là đối tác đồng hành 
              trong hành trình đầu tư của bạn. Với đội ngũ chuyên gia giàu kinh nghiệm 
              và mạng lưới rộng khắp, VSM cam kết mang đến những cơ hội đầu tư tốt nhất.
            </p>
            
            <div className="grid gap-4">
              {achievements.slice(0, 3).map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 animate-slide-in-right" style={{ animationDelay: `${index * 0.2}s` }}>
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-lg">{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-scale-in" style={{ animationDelay: "0.3s" }}>
            <Card className="border-0 bg-gradient-secondary shadow-luxury">
              <CardContent className="p-8">
                <h4 className="text-2xl font-bold text-secondary-foreground mb-6">
                  Cam kết của chúng tôi
                </h4>
                <div className="space-y-4">
                  {achievements.slice(3).map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary-light flex-shrink-0" />
                      <span className="text-secondary-foreground">{achievement}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-white/10 rounded-xl">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-light mb-2">0123.456.789</div>
                    <div className="text-secondary-foreground">Hotline tư vấn 24/7</div>
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
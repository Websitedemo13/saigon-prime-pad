import { Building2, Users, Award, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteContent } from "@/hooks/useSiteContent";

const defaultStats = [
  { icon: Building2, number: "500+", label: "Dự án thành công" },
  { icon: Users, number: "10,000+", label: "Khách hàng tin tưởng" },
  { icon: Award, number: "15+", label: "Năm kinh nghiệm" },
  { icon: TrendingUp, number: "95%", label: "Tỷ lệ hài lòng" },
];

const statIcons = [Building2, Users, Award, TrendingUp];

const defaultAchievements = [
  "Đối tác chiến lược của các chủ đầu tư hàng đầu",
  "Đội ngũ tư vấn chuyên nghiệp và giàu kinh nghiệm",
  "Hệ thống pháp lý minh bạch, uy tín",
  "Cam kết lợi nhuận đầu tư hấp dẫn",
  "Hỗ trợ vay vốn ngân hàng lên đến 80%",
  "Dịch vụ chăm sóc khách hàng 24/7"
];

export default function About() {
  const { data: aboutContent } = useSiteContent("about");
  const { data: contactContent } = useSiteContent("contact");
  const content = aboutContent?.content as Record<string, any> | null;
  const contact = contactContent?.content as Record<string, any> | null;

  const title = content?.title || "Về VSM Real Estate";
  const description = content?.description || "Với hơn 15 năm kinh nghiệm trong lĩnh vực bất động sản, VSM Real Estate tự hào là đối tác tin cậy của hàng nghìn khách hàng.";
  const videoUrl = content?.videoUrl || "";
  const whyChooseTitle = content?.whyChooseTitle || "Tại sao chọn VSM Real Estate?";
  const achievements: string[] = content?.achievements || defaultAchievements;
  const phone = contact?.phone || "0123.456.789";

  const stats = content?.stats?.length
    ? content.stats.map((s: any, i: number) => ({
        icon: statIcons[i] || TrendingUp,
        number: s.value,
        label: s.label,
      }))
    : defaultStats;

  return (
    <section className="py-20 bg-gradient-to-br from-background to-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">{description}</p>
        </div>

        {videoUrl && (
          <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-luxury">
            {videoUrl.includes("youtube") ? (
              <iframe
                src={videoUrl.replace("watch?v=", "embed/")}
                className="w-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video controls className="w-full aspect-video">
                <source src={videoUrl} type="video/mp4" />
              </video>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat: any, index: number) => (
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

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h3 className="text-3xl font-bold mb-6 text-primary">{whyChooseTitle}</h3>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Chúng tôi không chỉ là một công ty môi giới, mà là đối tác đồng hành 
              trong hành trình đầu tư của bạn.
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
                <h4 className="text-2xl font-bold text-secondary-foreground mb-6">Cam kết của chúng tôi</h4>
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
                    <div className="text-3xl font-bold text-primary-light mb-2">{phone}</div>
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

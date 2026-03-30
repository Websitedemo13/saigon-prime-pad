import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";

interface ReviewItem {
  name: string;
  location: string;
  rating: number;
  content: string;
  project: string;
  avatar?: string;
}

const defaultReviews: ReviewItem[] = [
  { name: "Anh Minh Tuấn", location: "Quận 7, TP.HCM", rating: 5, content: "Tôi đã mua được căn hộ mơ ước nhờ sự tư vấn tận tình của VSM.", project: "Vinhomes Central Park" },
  { name: "Chị Hương Lan", location: "Quận 2, TP.HCM", rating: 5, content: "Sau 6 tháng đầu tư với VSM, tôi đã có lợi nhuận 25%.", project: "Masteri Thảo Điền" },
  { name: "Anh Đức Hải", location: "Quận 9, TP.HCM", rating: 5, content: "VSM đã giúp tôi tìm được lô đất vàng trong khu đô thị mới.", project: "Vinhomes Grand Park" },
];

const defaultBadges = [
  { value: "4.9/5", label: "Điểm đánh giá" },
  { value: "100%", label: "Khách hàng hài lòng" },
  { value: "24/7", label: "Hỗ trợ tư vấn" },
  { value: "0%", label: "Phí tư vấn" },
];

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { data: reviewsContent } = useSiteContent("reviews");
  const content = reviewsContent?.content as Record<string, any> | null;

  const title = content?.title || "Khách Hàng Nói Gì Về VSM";
  const subtitle = content?.subtitle || "Hàng nghìn khách hàng đã tin tưởng lựa chọn VSM Real Estate";
  const reviews: ReviewItem[] = content?.reviews?.length ? content.reviews : defaultReviews;
  const trustBadges = content?.trustBadges?.length ? content.trustBadges : defaultBadges;

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const nextReview = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const getCurrentReviews = () => {
    const items = [];
    for (let i = 0; i < Math.min(3, reviews.length); i++) {
      items.push(reviews[(currentIndex + i) % reviews.length]);
    }
    return items;
  };

  return (
    <section id="reviews" className="py-20 bg-gradient-to-br from-accent/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div
            className="grid md:grid-cols-3 gap-6 mb-8"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {getCurrentReviews().map((review, index) => (
              <Card
                key={`${currentIndex}-${index}`}
                className={`card-hover border-0 bg-gradient-card animate-scale-in ${index === 1 ? "md:scale-105 shadow-luxury" : ""}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/30 mr-3" loading="lazy" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30 mr-3">
                        <User className="w-7 h-7 text-primary" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-lg">{review.name}</h4>
                      <p className="text-muted-foreground text-sm">{review.location}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <div className="relative mb-4">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                    <p className="text-muted-foreground leading-relaxed pl-6">{review.content}</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-sm font-medium text-primary">Dự án: {review.project}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={prevReview} className="rounded-full w-12 h-12 border-primary hover:bg-primary hover:text-primary-foreground">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextReview} className="rounded-full w-12 h-12 border-primary hover:bg-primary hover:text-primary-foreground">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex justify-center gap-2">
            {reviews.map((_, index) => (
              <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-primary scale-125" : "bg-primary/30"}`} />
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in">
          {trustBadges.map((item: any, i: number) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{item.value}</div>
              <div className="text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

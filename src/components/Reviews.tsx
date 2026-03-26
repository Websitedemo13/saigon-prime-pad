import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import avatar5 from "@/assets/avatar-5.jpg";

const reviews = [
  {
    id: 1,
    name: "Anh Minh Tuấn",
    location: "Quận 7, TP.HCM",
    rating: 5,
    content: "Tôi đã mua được căn hộ mơ ước nhờ sự tư vấn tận tình của VSM. Đội ngũ rất chuyên nghiệp, thủ tục nhanh chóng. Giá cả hợp lý, pháp lý minh bạch. Tôi sẽ giới thiệu cho bạn bè.",
    project: "Vinhomes Central Park",
    avatar: avatar1,
  },
  {
    id: 2,
    name: "Chị Hương Lan",
    location: "Quận 2, TP.HCM",
    rating: 5,
    content: "Sau 6 tháng đầu tư với VSM, tôi đã có lợi nhuận 25%. Họ không chỉ bán mà còn tư vấn đầu tư rất hay. Đặc biệt ấn tượng với dịch vụ hậu mãi chu đáo.",
    project: "Masteri Thảo Điền",
    avatar: avatar2,
  },
  {
    id: 3,
    name: "Anh Đức Hải",
    location: "Quận 9, TP.HCM",
    rating: 5,
    content: "VSM đã giúp tôi tìm được lô đất vàng trong khu đô thị mới. Từ khâu tìm hiểu, thẩm định đến hoàn tất thủ tục đều rất chuyên nghiệp. Cảm ơn team VSM!",
    project: "Vinhomes Grand Park",
    avatar: avatar3,
  },
  {
    id: 4,
    name: "Chị Mai Anh",
    location: "Quận 1, TP.HCM",
    rating: 5,
    content: "Đội ngũ VSM rất am hiểu thị trường. Họ đã tư vấn tôi mua căn shophouse với vị trí đắc địa. Hiện tại giá trị bất động sản đã tăng 30% sau 1 năm.",
    project: "Landmark 81",
    avatar: avatar4,
  },
  {
    id: 5,
    name: "Anh Quang Minh",
    location: "Bình Thạnh, TP.HCM",
    rating: 5,
    content: "Tôi rất hài lòng với dịch vụ của VSM. Không chỉ tư vấn mua bán mà còn hỗ trợ vay vốn ngân hàng với lãi suất ưu đãi. Thật sự là đối tác đáng tin cậy.",
    project: "The Sun Avenue",
    avatar: avatar5,
  },
];

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextReview = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const getCurrentReviews = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(reviews[(currentIndex + i) % reviews.length]);
    }
    return items;
  };

  return (
    <section id="reviews" className="py-20 bg-gradient-to-br from-accent/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Khách Hàng Nói Gì Về VSM
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hàng nghìn khách hàng đã tin tưởng và đạt được thành công trong đầu tư
            bất động sản cùng VSM Real Estate
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div
            className="grid md:grid-cols-3 gap-6 mb-8"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {getCurrentReviews().map((review, index) => (
              <Card
                key={review.id}
                className={`card-hover border-0 bg-gradient-card animate-scale-in ${
                  index === 1 ? "md:scale-105 shadow-luxury" : ""
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/30 mr-3"
                      loading="lazy"
                      width={56}
                      height={56}
                    />
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
                    <p className="text-muted-foreground leading-relaxed pl-6">
                      {review.content}
                    </p>
                  </div>

                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-sm font-medium text-primary">
                      Dự án: {review.project}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevReview}
              className="rounded-full w-12 h-12 border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextReview}
              className="rounded-full w-12 h-12 border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex justify-center gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-primary scale-125" : "bg-primary/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in">
          {[
            { value: "4.9/5", label: "Điểm đánh giá" },
            { value: "100%", label: "Khách hàng hài lòng" },
            { value: "24/7", label: "Hỗ trợ tư vấn" },
            { value: "0%", label: "Phí tư vấn" },
          ].map((item, i) => (
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

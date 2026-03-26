import luxuryApartment from "@/assets/luxury-apartment.jpg";
import propertyPenthouse from "@/assets/property-penthouse.jpg";
import propertyShophouse from "@/assets/property-shophouse.jpg";

export interface Property {
  id: number;
  slug: string;
  title: string;
  location: string;
  district: string;
  price: string;
  pricePerM2: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  type: string;
  status: string;
  roi: string;
  image: string;
  gallery: string[];
  features: string[];
  description: string;
  amenities: string[];
  developer: string;
  yearBuilt: string;
  floors: number;
  parking: string;
  nearbyPlaces: string[];
}

export const properties: Property[] = [
  {
    id: 1,
    slug: "can-ho-cao-cap-vinhomes-central-park",
    title: "Căn hộ cao cấp Vinhomes Central Park",
    location: "Quận Bình Thạnh, TP.HCM",
    district: "Bình Thạnh",
    price: "5.2 tỷ",
    pricePerM2: "85 triệu/m²",
    area: "75m²",
    bedrooms: 2,
    bathrooms: 2,
    type: "Căn hộ",
    status: "Sẵn sàng bàn giao",
    roi: "+12%/năm",
    image: luxuryApartment,
    gallery: [luxuryApartment, propertyPenthouse],
    features: ["View sông Sài Gòn", "Nội thất cao cấp Ý", "Bể bơi vô cực"],
    description: "Căn hộ cao cấp tọa lạc tại trung tâm dự án Vinhomes Central Park, sở hữu tầm nhìn panorama sông Sài Gòn tuyệt đẹp. Nội thất được thiết kế theo phong cách hiện đại với chất liệu nhập khẩu từ Ý. Hệ thống tiện ích 5 sao bao gồm bể bơi vô cực, phòng gym, spa, khu vui chơi trẻ em và công viên ven sông rộng 14 hecta.",
    amenities: ["Bể bơi vô cực", "Phòng gym hiện đại", "Spa & Sauna", "Khu vui chơi trẻ em", "Công viên ven sông 14ha", "Trung tâm thương mại Vincom", "Trường học Vinschool", "Bệnh viện Vinmec"],
    developer: "Vingroup",
    yearBuilt: "2018",
    floors: 45,
    parking: "2 chỗ đỗ xe hơi",
    nearbyPlaces: ["Landmark 81 - 500m", "Metro Bến Thành - 2km", "Sân bay Tân Sơn Nhất - 8km", "Quận 1 - 3km"]
  },
  {
    id: 2,
    slug: "penthouse-landmark-81-skyview",
    title: "Penthouse Landmark 81 Skyview",
    location: "Quận Bình Thạnh, TP.HCM",
    district: "Bình Thạnh",
    price: "25.8 tỷ",
    pricePerM2: "180 triệu/m²",
    area: "145m²",
    bedrooms: 3,
    bathrooms: 3,
    type: "Penthouse",
    status: "Độc quyền",
    roi: "+15%/năm",
    image: propertyPenthouse,
    gallery: [propertyPenthouse, luxuryApartment],
    features: ["Tầng cao nhất", "Sân vườn riêng", "View 360°"],
    description: "Penthouse đẳng cấp tại tòa nhà biểu tượng Landmark 81 - tòa nhà cao nhất Việt Nam. Sở hữu tầm nhìn 360 độ toàn cảnh thành phố Hồ Chí Minh từ độ cao trên 400m. Thiết kế nội thất bespoke với vật liệu quý hiếm, sân vườn riêng trên cao, hồ bơi riêng tư và dịch vụ butler 24/7.",
    amenities: ["Hồ bơi riêng", "Sân vườn trên cao", "Butler service 24/7", "Sky lounge", "Hầm rượu vang", "Phòng xì gà", "Thang máy riêng", "Smart home AI"],
    developer: "Vingroup",
    yearBuilt: "2020",
    floors: 81,
    parking: "3 chỗ đỗ xe hơi VIP",
    nearbyPlaces: ["Vinhomes Central Park - 0m", "Quận 1 - 3km", "Sân bay TSN - 8km", "Quận 7 - 5km"]
  },
  {
    id: 3,
    slug: "shophouse-the-sun-avenue",
    title: "Shophouse The Sun Avenue",
    location: "Quận 2, TP.HCM",
    district: "Quận 2",
    price: "12.5 tỷ",
    pricePerM2: "120 triệu/m²",
    area: "105m²",
    bedrooms: 4,
    bathrooms: 3,
    type: "Shophouse",
    status: "Kinh doanh tốt",
    roi: "+18%/năm",
    image: propertyShophouse,
    gallery: [propertyShophouse, luxuryApartment],
    features: ["Mặt tiền đường lớn", "Kinh doanh sẵn", "Vị trí đắc địa"],
    description: "Shophouse mặt tiền đường Mai Chí Thọ - tuyến đường huyết mạch kết nối Quận 2 với trung tâm thành phố. Thiết kế 2 tầng với mặt tiền rộng 6m, phù hợp cho kinh doanh nhà hàng, café, showroom hoặc văn phòng. Khu vực đang phát triển mạnh với mật độ dân cư cao, đảm bảo lưu lượng khách hàng ổn định.",
    amenities: ["Mặt tiền 6m", "2 tầng kinh doanh", "Bãi đỗ xe rộng", "Hệ thống PCCC", "Điều hòa trung tâm", "Camera an ninh 24/7", "Khu food court", "Cộng đồng cư dân 10,000+"],
    developer: "Novaland",
    yearBuilt: "2019",
    floors: 2,
    parking: "5 chỗ đỗ xe + bãi xe khách",
    nearbyPlaces: ["Metro Bến Thành - 1.5km", "Cầu Sài Gòn - 1km", "Đại học RMIT - 3km", "Quận 1 - 4km"]
  }
];

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find(p => p.slug === slug);
}

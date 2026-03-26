import luxuryApartment from "@/assets/luxury-apartment.jpg";
import propertyPenthouse from "@/assets/property-penthouse.jpg";
import propertyShophouse from "@/assets/property-shophouse.jpg";
import propertyVilla from "@/assets/property-villa.jpg";
import propertyHighrise from "@/assets/property-highrise.jpg";
import propertyLand from "@/assets/property-land.jpg";
import propertyOffice from "@/assets/property-office.jpg";
import propertyTownhouse from "@/assets/property-townhouse.jpg";

export interface Property {
  id: number;
  slug: string;
  title: string;
  location: string;
  district: string;
  price: string;
  priceNum: number; // in tỷ for sorting
  pricePerM2: string;
  area: string;
  areaNum: number; // in m² for sorting
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

export const propertyTypes = ["Tất cả", "Căn hộ", "Penthouse", "Shophouse", "Biệt thự", "Nhà phố", "Đất nền", "Văn phòng"];
export const districts = ["Tất cả", "Quận 1", "Quận 2", "Quận 7", "Quận 9", "Bình Thạnh", "Thủ Đức", "Gò Vấp", "Phú Nhuận", "Nhà Bè"];
export const priceRanges = [
  { label: "Tất cả", min: 0, max: Infinity },
  { label: "Dưới 3 tỷ", min: 0, max: 3 },
  { label: "3 - 5 tỷ", min: 3, max: 5 },
  { label: "5 - 10 tỷ", min: 5, max: 10 },
  { label: "10 - 20 tỷ", min: 10, max: 20 },
  { label: "Trên 20 tỷ", min: 20, max: Infinity },
];

export const properties: Property[] = [
  {
    id: 1,
    slug: "can-ho-cao-cap-vinhomes-central-park",
    title: "Căn hộ cao cấp Vinhomes Central Park",
    location: "Quận Bình Thạnh, TP.HCM",
    district: "Bình Thạnh",
    price: "5.2 tỷ",
    priceNum: 5.2,
    pricePerM2: "85 triệu/m²",
    area: "75m²",
    areaNum: 75,
    bedrooms: 2,
    bathrooms: 2,
    type: "Căn hộ",
    status: "Sẵn sàng bàn giao",
    roi: "+12%/năm",
    image: luxuryApartment,
    gallery: [luxuryApartment, propertyPenthouse, propertyHighrise],
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
    priceNum: 25.8,
    pricePerM2: "180 triệu/m²",
    area: "145m²",
    areaNum: 145,
    bedrooms: 3,
    bathrooms: 3,
    type: "Penthouse",
    status: "Độc quyền",
    roi: "+15%/năm",
    image: propertyPenthouse,
    gallery: [propertyPenthouse, luxuryApartment, propertyHighrise],
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
    priceNum: 12.5,
    pricePerM2: "120 triệu/m²",
    area: "105m²",
    areaNum: 105,
    bedrooms: 4,
    bathrooms: 3,
    type: "Shophouse",
    status: "Kinh doanh tốt",
    roi: "+18%/năm",
    image: propertyShophouse,
    gallery: [propertyShophouse, luxuryApartment, propertyOffice],
    features: ["Mặt tiền đường lớn", "Kinh doanh sẵn", "Vị trí đắc địa"],
    description: "Shophouse mặt tiền đường Mai Chí Thọ - tuyến đường huyết mạch kết nối Quận 2 với trung tâm thành phố. Thiết kế 2 tầng với mặt tiền rộng 6m, phù hợp cho kinh doanh nhà hàng, café, showroom hoặc văn phòng. Khu vực đang phát triển mạnh với mật độ dân cư cao.",
    amenities: ["Mặt tiền 6m", "2 tầng kinh doanh", "Bãi đỗ xe rộng", "Hệ thống PCCC", "Điều hòa trung tâm", "Camera an ninh 24/7", "Khu food court", "Cộng đồng cư dân 10,000+"],
    developer: "Novaland",
    yearBuilt: "2019",
    floors: 2,
    parking: "5 chỗ đỗ xe + bãi xe khách",
    nearbyPlaces: ["Metro Bến Thành - 1.5km", "Cầu Sài Gòn - 1km", "Đại học RMIT - 3km", "Quận 1 - 4km"]
  },
  {
    id: 4,
    slug: "biet-thu-vuon-ecopark-riverside",
    title: "Biệt thự vườn Ecopark Riverside",
    location: "Quận 9, TP.HCM",
    district: "Quận 9",
    price: "18.5 tỷ",
    priceNum: 18.5,
    pricePerM2: "62 triệu/m²",
    area: "300m²",
    areaNum: 300,
    bedrooms: 5,
    bathrooms: 4,
    type: "Biệt thự",
    status: "Mở bán đợt 1",
    roi: "+20%/năm",
    image: propertyVilla,
    gallery: [propertyVilla, propertyPenthouse, luxuryApartment],
    features: ["Hồ bơi riêng", "Sân vườn 150m²", "Smart home toàn diện"],
    description: "Biệt thự vườn đẳng cấp nằm trong khu compound an ninh 24/7, được bao bọc bởi hệ thống cây xanh và mặt nước. Thiết kế kiến trúc nhiệt đới hiện đại với không gian mở, tận dụng tối đa ánh sáng tự nhiên. Hồ bơi riêng, sân vườn rộng và hệ thống smart home điều khiển bằng AI.",
    amenities: ["Hồ bơi riêng", "Sân vườn nhiệt đới", "Smart home AI", "Phòng gym riêng", "Hầm rượu vang", "Garage 3 xe", "BBQ garden", "Khu compound an ninh", "Câu lạc bộ golf", "Trường quốc tế"],
    developer: "Capitaland",
    yearBuilt: "2024",
    floors: 3,
    parking: "Garage 3 xe hơi",
    nearbyPlaces: ["Vincom Mega Mall - 2km", "Bệnh viện quốc tế - 3km", "Trường quốc tế BIS - 1.5km", "Sân golf Long Thành - 15km"]
  },
  {
    id: 5,
    slug: "can-ho-studio-masteri-an-phu",
    title: "Căn hộ Studio Masteri An Phú",
    location: "Quận 2, TP.HCM",
    district: "Quận 2",
    price: "2.8 tỷ",
    priceNum: 2.8,
    pricePerM2: "70 triệu/m²",
    area: "40m²",
    areaNum: 40,
    bedrooms: 1,
    bathrooms: 1,
    type: "Căn hộ",
    status: "Cho thuê tốt",
    roi: "+10%/năm",
    image: propertyHighrise,
    gallery: [propertyHighrise, luxuryApartment],
    features: ["Full nội thất", "View thành phố", "Gần metro"],
    description: "Căn hộ studio thiết kế thông minh, tối ưu không gian sống cho người trẻ năng động. Vị trí ngay trung tâm Quận 2, cách ga metro An Phú chỉ 200m. Full nội thất cao cấp, sẵn sàng cho thuê với lợi nhuận hấp dẫn. Phù hợp cho đầu tư cho thuê hoặc ở cho cặp đôi trẻ.",
    amenities: ["Bể bơi tầng thượng", "Phòng gym", "Co-working space", "Minimart", "Khu giặt ủi", "Bãi xe thông minh", "Sân BBQ", "Khu vui chơi"],
    developer: "Masterise Homes",
    yearBuilt: "2021",
    floors: 35,
    parking: "1 chỗ đỗ xe",
    nearbyPlaces: ["Ga Metro An Phú - 200m", "Vincom Thảo Điền - 1km", "Quận 1 - 5km", "Sân bay TSN - 10km"]
  },
  {
    id: 6,
    slug: "dat-nen-khu-do-thi-sala",
    title: "Đất nền Khu đô thị Sala",
    location: "Quận 2, TP.HCM",
    district: "Quận 2",
    price: "35 tỷ",
    priceNum: 35,
    pricePerM2: "200 triệu/m²",
    area: "175m²",
    areaNum: 175,
    bedrooms: 0,
    bathrooms: 0,
    type: "Đất nền",
    status: "Pháp lý sạch",
    roi: "+25%/năm",
    image: propertyLand,
    gallery: [propertyLand, propertyVilla],
    features: ["Sổ hồng riêng", "Xây dựng tự do", "Hạ tầng hoàn chỉnh"],
    description: "Lô đất nền vàng tại khu đô thị kiểu mẫu Sala - một trong những khu đô thị đẳng cấp nhất Quận 2. Pháp lý sạch với sổ hồng riêng, hạ tầng hoàn chỉnh. Vị trí đắc địa ngay trung tâm hành chính Thủ Thiêm, phù hợp xây biệt thự hoặc nhà phố thương mại.",
    amenities: ["Hạ tầng hoàn chỉnh", "Đường nội bộ 12m", "Hệ thống cống ngầm", "Cây xanh công cộng", "Công viên ven sông", "An ninh khu compound", "Gần trường quốc tế", "Gần bệnh viện"],
    developer: "Đại Quang Minh",
    yearBuilt: "2023",
    floors: 0,
    parking: "Không giới hạn",
    nearbyPlaces: ["Trung tâm Thủ Thiêm - 500m", "Cầu Thủ Thiêm 2 - 1km", "Quận 1 - 2km", "Metro Bến Thành - 3km"]
  },
  {
    id: 7,
    slug: "van-phong-hang-a-bitexco",
    title: "Văn phòng hạng A Bitexco Tower",
    location: "Quận 1, TP.HCM",
    district: "Quận 1",
    price: "8.5 tỷ",
    priceNum: 8.5,
    pricePerM2: "150 triệu/m²",
    area: "56m²",
    areaNum: 56,
    bedrooms: 0,
    bathrooms: 1,
    type: "Văn phòng",
    status: "Đang hoạt động",
    roi: "+14%/năm",
    image: propertyOffice,
    gallery: [propertyOffice, propertyHighrise],
    features: ["View sông trực diện", "Full nội thất VP", "Tòa nhà biểu tượng"],
    description: "Văn phòng hạng A tại tòa nhà biểu tượng Bitexco Financial Tower - trung tâm tài chính Quận 1. Không gian làm việc hiện đại với view sông Sài Gòn trực diện. Phù hợp cho các công ty tài chính, luật, công nghệ muốn khẳng định thương hiệu tại vị trí đắc địa nhất thành phố.",
    amenities: ["Lobby sang trọng", "Thang máy tốc độ cao", "Hệ thống HVAC", "Internet cáp quang", "Phòng họp chung", "Pantry", "Bãi xe ngầm", "An ninh 24/7", "Dịch vụ lễ tân"],
    developer: "Bitexco Group",
    yearBuilt: "2010",
    floors: 68,
    parking: "2 chỗ đỗ xe hầm",
    nearbyPlaces: ["Bến Bạch Đằng - 200m", "Chợ Bến Thành - 500m", "Nhà hát TP - 300m", "Phố đi bộ Nguyễn Huệ - 100m"]
  },
  {
    id: 8,
    slug: "nha-pho-lakeview-city",
    title: "Nhà phố Lakeview City",
    location: "Quận 2, TP.HCM",
    district: "Quận 2",
    price: "14.8 tỷ",
    priceNum: 14.8,
    pricePerM2: "95 triệu/m²",
    area: "156m²",
    areaNum: 156,
    bedrooms: 4,
    bathrooms: 4,
    type: "Nhà phố",
    status: "Đã có sổ hồng",
    roi: "+16%/năm",
    image: propertyTownhouse,
    gallery: [propertyTownhouse, propertyVilla, luxuryApartment],
    features: ["Khu compound an ninh", "Ven hồ sinh thái", "Hoàn thiện nội thất"],
    description: "Nhà phố liền kề trong khu compound đẳng cấp Lakeview City, bao quanh bởi hồ sinh thái và công viên cây xanh. Thiết kế 3 tầng với 4 phòng ngủ rộng rãi, phù hợp cho gia đình đa thế hệ. Nội thất hoàn thiện cao cấp, sẵn sàng dọn vào ở. An ninh 24/7 với hệ thống camera và bảo vệ chuyên nghiệp.",
    amenities: ["Hồ sinh thái", "Công viên trung tâm", "Clubhouse", "Bể bơi cộng đồng", "Sân tennis", "Trường mầm non", "Siêu thị mini", "Khu BBQ", "Đường dạo bộ ven hồ", "Khu tập thể dục ngoài trời"],
    developer: "Novaland",
    yearBuilt: "2020",
    floors: 3,
    parking: "Garage 2 xe + sân trước",
    nearbyPlaces: ["Mega Market - 1km", "BV Quận 2 - 2km", "Cầu Sài Gòn - 3km", "Quận 1 - 6km"]
  },
  {
    id: 9,
    slug: "can-ho-the-ascentia-phu-my-hung",
    title: "Căn hộ The Ascentia Phú Mỹ Hưng",
    location: "Quận 7, TP.HCM",
    district: "Quận 7",
    price: "6.8 tỷ",
    priceNum: 6.8,
    pricePerM2: "78 triệu/m²",
    area: "87m²",
    areaNum: 87,
    bedrooms: 2,
    bathrooms: 2,
    type: "Căn hộ",
    status: "Nhận nhà 2025",
    roi: "+13%/năm",
    image: propertyHighrise,
    gallery: [propertyHighrise, luxuryApartment, propertyPenthouse],
    features: ["Phú Mỹ Hưng view kênh", "Tiện ích đa tầng", "Thiết kế Nhật Bản"],
    description: "Căn hộ cao cấp tại dự án The Ascentia nằm trong lòng khu đô thị Phú Mỹ Hưng - khu đô thị kiểu mẫu hàng đầu Đông Nam Á. Thiết kế bởi kiến trúc sư Nhật Bản với triết lý Zen, tối ưu ánh sáng và gió tự nhiên. Hệ thống tiện ích đa tầng bao gồm sky garden, infinity pool và rooftop lounge.",
    amenities: ["Sky garden", "Infinity pool", "Rooftop lounge", "Yoga garden", "Kids zone", "Library", "Co-living space", "EV charging station"],
    developer: "Phú Mỹ Hưng Corp",
    yearBuilt: "2025",
    floors: 40,
    parking: "2 chỗ đỗ xe",
    nearbyPlaces: ["Crescent Mall - 500m", "BV FV - 1km", "Trường quốc tế SSIS - 2km", "Quận 1 - 7km"]
  },
];

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find(p => p.slug === slug);
}

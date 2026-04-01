import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Properties from "@/components/Properties";
import MapSection from "@/components/MapSection";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import CustomSection from "@/components/CustomSection";
import { useSiteContent } from "@/hooks/useSiteContent";

const BUILTIN_COMPONENTS: Record<string, React.FC> = {
  hero: Hero,
  about: About,
  properties: Properties,
  map: MapSection,
  reviews: Reviews,
  contact: Contact,
};

const SECTION_IDS: Record<string, string> = {
  hero: "hero",
  about: "about",
  map: "map",
  contact: "contact",
};

const Index = () => {
  const { data: layoutData } = useSiteContent("page_layout");
  const layout = layoutData?.content as any;

  const sections = layout?.sections || [
    { id: "hero", type: "builtin", visible: true },
    { id: "about", type: "builtin", visible: true },
    { id: "properties", type: "builtin", visible: true },
    { id: "map", type: "builtin", visible: true },
    { id: "reviews", type: "builtin", visible: true },
    { id: "contact", type: "builtin", visible: true },
  ];
  const customSections = layout?.customSections || {};

  return (
    <div className="min-h-screen">
      <Header />
      {sections
        .filter((s: any) => s.visible)
        .map((s: any) => {
          if (s.type === "builtin") {
            const Component = BUILTIN_COMPONENTS[s.id];
            if (!Component) return null;
            const sectionId = SECTION_IDS[s.id];
            return sectionId ? (
              <div key={s.id} id={sectionId}><Component /></div>
            ) : (
              <Component key={s.id} />
            );
          }
          if (s.type === "custom" && customSections[s.id]) {
            const data = customSections[s.id];
            return (
              <CustomSection
                key={s.id}
                id={s.id}
                title={data.title}
                content={data.content}
                backgroundImage={data.backgroundImage}
                backgroundColor={data.backgroundColor}
              />
            );
          }
          return null;
        })}
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;

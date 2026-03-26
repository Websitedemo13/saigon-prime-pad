import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Properties from "@/components/Properties";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div id="hero"><Hero /></div>
      <div id="about"><About /></div>
      <Properties />
      <Reviews />
      <div id="contact"><Contact /></div>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;

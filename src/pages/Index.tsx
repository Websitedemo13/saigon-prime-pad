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
      <Hero />
      <About />  
      <Properties />
      <Reviews />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;

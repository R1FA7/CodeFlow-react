import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import { CTASection } from "../components/CTASection";
import { FeaturesSection } from "../components/FeatureSection";
import { HeroSection } from "../components/HeroSection";
import { HowItWorksSection } from "../components/HowItWorksSection";

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
};

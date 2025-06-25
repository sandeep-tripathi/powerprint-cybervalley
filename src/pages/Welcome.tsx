
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/welcome/HeroSection";
import WorkflowsSection from "@/components/welcome/WorkflowsSection";
import PlatformPricingBanner from "@/components/welcome/PlatformPricingBanner";
import FeaturesSection from "@/components/welcome/FeaturesSection";
import ComputeInstancesSection from "@/components/welcome/ComputeInstancesSection";
import CTASection from "@/components/welcome/CTASection";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <WorkflowsSection />
        <PlatformPricingBanner />
        <FeaturesSection />
        <ComputeInstancesSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Welcome;

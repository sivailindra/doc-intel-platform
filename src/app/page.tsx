import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { TrustBar } from '@/components/TrustBar';
import { PipelineSection } from '@/components/PipelineSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { IndustrySection } from '@/components/IndustrySection';
import { HowItWorksAndTestimonials } from '@/components/HowItWorksTestimonials';
import { UploadSection } from '@/components/UploadSection';
import { CTABanner, Footer } from '@/components/PricingFooter';
import { FloatingCTA } from '@/components/FloatingCTA';
import { ChatbotBubble } from '@/components/ChatbotBubble';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <PipelineSection />
        <FeaturesSection />
        <IndustrySection />
        <HowItWorksAndTestimonials />
        <UploadSection />
        <CTABanner />
      </main>
      <Footer />
      <FloatingCTA />
      <ChatbotBubble />
    </>
  );
}

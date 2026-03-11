import { AnalyzeSection } from "@/components/AnalyzeSection";
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/PricingFooter';

export const metadata = {
    title: "Document Analysis | docIntel",
    description: "Analyze and verify identity documents with enterprise-grade AI.",
};

export default function AnalyzePage() {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--color-base)]">
            <Navbar />
            <main className="flex-1">
                <AnalyzeSection />
            </main>
            <Footer />
        </div>
    );
}

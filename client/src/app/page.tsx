import Header from '@/lib/components/landing-page/Header';
import Hero from '@/lib/components/landing-page/Hero';
import Stats from '@/lib/components/landing-page/Stats';
import HowItWorks from '@/lib/components/landing-page/HowItWorks';
import WhoItsFor from '@/lib/components/landing-page/WhoItsFor';
import FeaturesHighlight from '@/lib/components/landing-page/FeaturesHighlight';
import FAQ from '@/lib/components/landing-page/Faq';
import CTA from '@/lib/components/landing-page/Cta';
import Footer from '@/lib/components/landing-page/Footer';
import { auth } from '../../auth';

export default async function LandingPage() {
    const session = await auth();

    return (
        <div className="min-h-screen bg-white">
            <Header session={session} showNav={true} />
            <Hero session={session} />
            <Stats />
            <HowItWorks />
            <WhoItsFor />
            <FeaturesHighlight />
            <FAQ />
            <CTA />
            <Footer />
        </div>
    );
}

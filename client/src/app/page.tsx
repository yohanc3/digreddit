import Header from '@/lib/components/landing-page/Header';
import Hero from '@/lib/components/landing-page/Hero';
import HowItWorks from '@/lib/components/landing-page/HowItWorks';
import WhoItsFor from '@/lib/components/landing-page/WhoItsFor';
import Faq from '@/lib/components/landing-page/Faq';
import Cta from '@/lib/components/landing-page/Cta';
import Footer from '@/lib/components/landing-page/Footer';
import { auth } from '../../auth';

export default async function Home() {
    const session = await auth();

    return (
        <div className="min-h-screen">
            <Header session={session} />
            <Hero session={session} />
            <HowItWorks />
            <WhoItsFor />
            {/* <RealTimeDemo /> */}
            {/* <Testimonials /> */}
            {/* <Pricing /> */}
            <Faq />
            <Cta />
            <Footer />
        </div>
    );
}

import Header from '@/lib/components/landing-page/Header';
import Hero from '@/lib/components/landing-page/Hero';
import HowItWorks from '@/lib/components/landing-page/HowItWorks';
import WhoItsFor from '@/lib/components/landing-page/WhoItsFor';
import RealTimeDemo from '@/lib/components/landing-page/RealTimeDemo';
import Testimonials from '@/lib/components/landing-page/Testimonials';
import Pricing from '@/lib/components/landing-page/Pricing';
import Faq from '@/lib/components/landing-page/Faq';
import Cta from '@/lib/components/landing-page/Cta';
import Footer from '@/lib/components/landing-page/Footer';
import { auth } from '../../auth';

export default async function Home() {
    const session = await auth();

    console.log('session: ', session);

    return (
        <div className="min-h-screen">
            <Header session={session} />
            <Hero session={session} />
            <HowItWorks />
            <WhoItsFor />
            <RealTimeDemo />
            <Testimonials />
            <Pricing />
            <Faq />
            <Cta />
            <Footer />
        </div>
    );
}

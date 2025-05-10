import LightButton from '../button/light';

export default function Cta() {
    return (
        <section className="bg-[#576F72] py-20 text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-6">
                    Ready to Find Your Next Customer?
                </h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                    Start turning Reddit conversations into qualified leads for
                    your business today.
                </p>
                <LightButton
                    title="Get Started For Free"
                    className="bg-white text-[#576F72] hover:bg-gray-100"
                />
            </div>
        </section>
    );
}

import { Filter, Search, MessageSquare } from 'lucide-react';

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="bg-gray-50 py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-16">
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-[#576F72]/10 p-4 rounded-full mb-6">
                            <Search className="h-8 w-8 text-[#576F72]" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Step 1</h3>
                        <p className="text-gray-600">
                            We scan every Reddit post & comment in real-time
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-[#576F72]/10 p-4 rounded-full mb-6">
                            <Filter className="h-8 w-8 text-[#576F72]" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Step 2</h3>
                        <p className="text-gray-600">
                            We match posts and comments based on keywords that
                            resemble your product, or service's target audience.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-[#576F72]/10 p-4 rounded-full mb-6">
                            <MessageSquare className="h-8 w-8 text-[#576F72]" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Step 3</h3>
                        <p className="text-gray-600">
                            We deliver relevant leads directly in the webapp and
                            your email inbox (every hour).
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

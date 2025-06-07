import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/lib/components/ui/card';
import { Search, Filter, MessageSquare } from 'lucide-react';

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Our AI-powered system monitors Reddit 24/7 to find the
                        perfect leads for your business
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="relative overflow-hidden border-0 shadow-lg">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#576F72] to-[#344054]"></div>
                        <CardHeader className="text-center pb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-[#576F72] to-[#344054] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-xl">
                                Real-Time Scanning
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-gray-600">
                                We scan every Reddit post & comment in real-time
                                across all subreddits, processing millions of
                                conversations daily.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 shadow-lg">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#576F72] to-[#344054]"></div>
                        <CardHeader className="text-center pb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-[#576F72] to-[#344054] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Filter className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-xl">
                                Smart Matching
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-gray-600">
                                Our AI matches posts and comments based on your
                                product keywords, target audience, and business
                                context with 94% accuracy.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 shadow-lg">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#576F72] to-[#344054]"></div>
                        <CardHeader className="text-center pb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-[#576F72] to-[#344054] rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-xl">
                                Instant Delivery
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-gray-600">
                                Get qualified leads delivered to your dashboard
                                and email within 15-30 seconds, so you can be
                                first to respond.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}

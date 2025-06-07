import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/lib/components/ui/card';
import { Zap, Users, Target, Globe, TrendingUp, Clock } from 'lucide-react';

export default function WhoItsFor() {
    return (
        <section id="who-its-for" className="bg-gray-50 py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Perfect For Growing Businesses
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Whether you're a startup or established company,
                        DigReddit helps you find customers where they're already
                        talking
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 bg-[#576F72]/10 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="h-6 w-6 text-[#576F72]" />
                            </div>
                            <CardTitle>SaaS Founders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Find users discussing problems your software
                                solves. Perfect for product validation and
                                customer acquisition.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 bg-[#576F72]/10 rounded-lg flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-[#576F72]" />
                            </div>
                            <CardTitle>Marketing Agencies</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Scale your client acquisition by monitoring
                                conversations about their industry and
                                competitors.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 bg-[#576F72]/10 rounded-lg flex items-center justify-center mb-4">
                                <Target className="h-6 w-6 text-[#576F72]" />
                            </div>
                            <CardTitle>Sales Teams</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Identify warm prospects who are actively seeking
                                solutions you provide, increasing conversion
                                rates.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 bg-[#576F72]/10 rounded-lg flex items-center justify-center mb-4">
                                <Globe className="h-6 w-6 text-[#576F72]" />
                            </div>
                            <CardTitle>E-commerce Brands</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Discover customers looking for products like
                                yours and engage them before your competitors
                                do.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 bg-[#576F72]/10 rounded-lg flex items-center justify-center mb-4">
                                <TrendingUp className="h-6 w-6 text-[#576F72]" />
                            </div>
                            <CardTitle>Growth Hackers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Automate lead generation and focus on what
                                matters most - converting prospects into
                                customers.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 bg-[#576F72]/10 rounded-lg flex items-center justify-center mb-4">
                                <Clock className="h-6 w-6 text-[#576F72]" />
                            </div>
                            <CardTitle>Consultants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Find businesses discussing challenges in your
                                expertise area and offer your consulting
                                services.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}

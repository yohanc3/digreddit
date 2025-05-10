import { Card, CardContent } from '@/lib/components/ui/card';

export default function Testimonials() {
    const testimonials = [
        {
            quote: 'DigReddit helped us find 15 new clients in our first month. The leads are incredibly targeted.',
            author: 'Sarah J.',
            company: 'TechGrowth Agency',
        },
        {
            quote: 'As a solo founder, this tool is like having a dedicated sales team working 24/7.',
            author: 'Michael T.',
            company: 'DevTools SaaS',
        },
        {
            quote: 'The quality of leads is impressive. These are people actively looking for solutions like ours.',
            author: 'Alex R.',
            company: 'RecruitPro',
        },
    ];

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-16">
                    What Our Users Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="h-full">
                            <CardContent className="pt-6">
                                <p className="italic text-gray-700 mb-4">
                                    "{testimonial.quote}"
                                </p>
                                <div>
                                    <p className="font-medium">
                                        {testimonial.author}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {testimonial.company}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="flex justify-center gap-8 mt-16">
                    <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        LOGO
                    </div>
                    <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        LOGO
                    </div>
                    <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        LOGO
                    </div>
                    <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        LOGO
                    </div>
                </div>
            </div>
        </section>
    );
}

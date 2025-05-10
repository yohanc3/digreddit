import { Card, CardContent } from '@/lib/components/ui/card';
import { Building2, User, Users, UserSearch, Lightbulb } from 'lucide-react';

export default function WhoItsFor() {
    const audiences = [
        {
            title: 'B2B SaaS startups',
            description: 'Find prospects asking about tools like yours',
            icon: Building2,
        },
        {
            title: 'Solo founders',
            description: 'Discover potential customers without a sales team',
            icon: User,
        },
        {
            title: 'Agencies',
            description: 'Identify businesses needing your services',
            icon: Users,
        },
        {
            title: 'Recruiters',
            description: 'Spot talent discussing career moves',
            icon: UserSearch,
        },
        {
            title: 'Consultants',
            description: 'Connect with people seeking your expertise',
            icon: Lightbulb,
        },
    ];

    return (
        <section className="py-20" id="who-its-for">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-16">
                    Who It's For
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {audiences.map((item, index) => (
                        <Card key={index} className="h-full">
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <div className="mb-4 p-3 rounded-full bg-gray-100">
                                    <item.icon className="h-6 w-6 text-primaryColor" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-primaryColor">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

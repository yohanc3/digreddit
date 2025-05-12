'use client';

import { Badge } from '@/lib/components/ui/badge';
import { Button } from '@/lib/components/ui/button';
import { DeleteIcon, X } from 'lucide-react';

const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Energy',
    'Transportation',
    'Real Estate',
    'Hospitality',
    'Entertainment',
    'Agriculture',
    'Telecommunications',
    'Construction',
    'Legal Services',
    'Food and Beverage',
    'Automotive',
    'Aerospace',
    'Pharmaceuticals',
    'Insurance',
    'Consulting',
    'Media and Publishing',
    'Marketing and Advertising',
    'Fashion and Apparel',
    'Biotechnology',
    'Cybersecurity',
    'Environmental Services',
    'Nonprofit Organizations',
    'Government',
    'Mining and Metals',
    'Logistics and Supply Chain',
    'Sports and Recreation',
    'Tourism and Travel',
    'Architecture and Design',
    'Human Resources',
    'Petroleum and Gas',
    'Home and Garden',
    'Arts and Crafts',
    'Event Management',
    'Marine and Shipping',
    'Electronics',
    'Venture Capital and Private Equity',
    'Luxury Goods and Jewelry',
    'Fitness and Wellness',
    'Public Relations',
    'Waste Management',
    'Data and Analytics',
    'Blockchain and Cryptocurrency',
    'E-commerce',
    'Education Technology (EdTech)',
];

export default function Dashboard() {
    return (
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto gap-y-4 px-4 pt-12 pb-8">
            {/* Title */}
            <div className="flex flex-col mb-2">
                <h1 className="text-3xl md:text-4xl font-semibold text-center text-secondaryColor">
                    Launch a Lead Search
                </h1>
                <p className="text-sm text-primaryColor text-center mt-1">
                    Describe your target lead, and we'll dig through Reddit for
                    you.
                </p>
            </div>

            {/* Lead Description */}
            <textarea
                className="w-full h-40 p-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                placeholder='Tell use about your product and describe target audience (e.g., "I am working on a platform for clay artists and my target audience are people who like clay art, sculpture, architecture, etc..").'
            />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="flex flex-col gap-y-1">
                    <label className="text-secondaryColor text-sm font-medium">
                        Name:
                    </label>
                    <input
                        className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                        placeholder="e.g., DigReddit, Twitter, or KeepSake"
                    />
                </div>

                {/* Industry */}
                <div className="flex flex-col gap-y-1">
                    <label className="text-secondaryColor text-sm font-medium">
                        Industry:
                    </label>
                    <input
                        className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                        placeholder="e.g., Real Estate, Tech, or Politics"
                    />
                </div>
            </div>

            {/* MRR */}
            <div className="flex flex-col gap-y-1">
                <label className="text-secondaryColor text-sm font-medium">
                    MRR (Optional):
                </label>
                <input
                    className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                    placeholder="e.g., 6000, 10000"
                />
            </div>

            {/* Keywords Input */}
            <div className="flex flex-col gap-y-1 mt-1">
                <label className="text-secondaryColor text-sm font-medium">
                    Keywords:
                </label>
                <input
                    className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                    placeholder="e.g., Tax, Sports, or Law"
                />
                <p className="text-tertiaryColor text-xs mt-1">
                    Add up to 50 keywords. Press Enter to add each one.
                </p>

                {/* Keywords List */}
                <div className="flex flex-wrap gap-1.5 w-full mt-2 overflow-y-auto p-1">
                    {industries.map((item: string, index: number) => (
                        <Badge
                            key={index}
                            variant={'leadKeyword'}
                            className="text-xs py-0.5 px-2 flex items-center justify-center gap-x-2"
                        >
                            {item}{' '}
                            <X
                                key={index}
                                width={13}
                                strokeWidth={3}
                                className="cursor-pointer text-red-400"
                                onClick={() => console.log('hello')}
                            />
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="flex justify-end mt-2">
                <Button variant={'dark'} className="w-40 h-9 text-sm">
                    Create New Product
                </Button>
            </div>
        </div>
    );
}

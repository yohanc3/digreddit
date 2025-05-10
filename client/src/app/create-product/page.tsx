import { db } from '@/db';
import { users } from '@/db/schema';
import RedditLeadCard from '@/components/ui/lead/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Manufacturing",
    "Energy",
    "Transportation",
    "Real Estate",
    "Hospitality",
    "Entertainment",
    "Agriculture",
    "Telecommunications",
    "Construction",
    "Legal Services",
    "Food and Beverage",
    "Automotive",
    "Aerospace",
    "Pharmaceuticals",
    "Insurance",
    "Consulting",
    "Media and Publishing",
    "Marketing and Advertising",
    "Fashion and Apparel",
    "Biotechnology",
    "Cybersecurity",
    "Environmental Services",
    "Nonprofit Organizations",
    "Government",
    "Mining and Metals",
    "Logistics and Supply Chain",
    "Sports and Recreation",
    "Tourism and Travel",
    "Architecture and Design",
    "Human Resources",
    "Petroleum and Gas",
    "Home and Garden",
    "Arts and Crafts",
    "Event Management",
    "Marine and Shipping",
    "Electronics",
    "Venture Capital and Private Equity",
    "Luxury Goods and Jewelry",
    "Fitness and Wellness",
    "Public Relations",
    "Waste Management",
    "Data and Analytics",
    "Blockchain and Cryptocurrency",
    "E-commerce",
    "Education Technology (EdTech)"
];


export default async function Dashboard() {
    // const usersData = await db.select().from(users);

    // const firstUser = usersData.at(0);

    // console.log('first user: ', firstUser);

    return (
        <div className="flex flex-col h-full w-4/6 border-l-light border-l border-r-light border-r gap-y-6 px-5 pb-10">
            
            {/* Title */}
            <div className='flex flex-col'>
                <div className='text-[5rem] font-semibold text-center text-secondaryColor h-min'>
                    Launch a Lead Search
                </div>
                <div className='text-mediumSize text-primaryColor text-center'>
                    Describe your target lead, and we’ll dig through Reddit for you.
                </div>
            </div>

            {/* Lead Description */}
            <textarea className='w-full h-64 p-4 rounded-md border-light border' placeholder='Tell use about your product and describe target audience (e.g., “I am working on a platform for clay artists and my target audience are people who like clay art, sculpture, architecture, etc..”).' />

            {/* Product Name */}
            <div className='flex flex-col gap-y-2'>
                <label className='text-secondaryColor text-mediumSize font-semibold'>Name:</label>
                <input className='py-2 px-3 rounded-md border-light border' placeholder='e.g., DigReddit, Twitter, or KeepSake'></input>
            </div>

            {/* Product Name */}
            <div className='flex flex-col gap-y-2'>
                <label className='text-secondaryColor text-mediumSize font-semibold'>Industry:</label>
                <input className='py-2 px-3 rounded-md border-light border' placeholder='e.g., Real Estate, Tech, or Politics'></input>
            </div>

            {/* Product Name */}
            <div className='flex flex-col gap-y-2'>
                <label className='text-secondaryColor text-mediumSize font-semibold'>MRR:</label>
                <input className='py-2 px-3 rounded-md border-light border' placeholder='e.g., 6000, 10000'></input>
            </div>

            {/* Keywords Input */}
            <div className='flex flex-col gap-y-2'>
                <label className='text-secondaryColor text-mediumSize font-semibold'>Keywords:</label>
                <input className='py-2 px-3 rounded-md border-light border' placeholder='e.g., Tax, Sports, or Law'></input>
                <p className='text-tertiaryColor text-secondarySize'>Add up to 50 keywords. Press Enter to add each one.</p>
                {/* Keywords List */}
                <div className='flex flex-wrap gap-2 w-full'>
                    {
                        industries.map((item: string) => {
                            return <Badge variant={"leadKeyword"}>{item}</Badge>
                        })
                    }
                </div>
            </div>

            <div className='flex justify-end'>
                <Button variant={"dark"} className='!w-52'>Create New Product</Button>
            </div>

        </div>
    );
}

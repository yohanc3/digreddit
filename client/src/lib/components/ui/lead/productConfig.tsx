import clsx from 'clsx';
import { Button } from '../button';
import { useState } from 'react';
import { Badge } from '../badge';

interface ProductConfigProps {
    className?: string;
}


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

export default function ProductConfig({
    className,
}: ProductConfigProps) {
    const [showProductConfig, setShowProductConfig] = useState(false)
    return (
        <div
            className={clsx(
                'p-4 w-full flex flex-col gap-y-2',
                className
            )}
        >
            <div className="flex items-center gap-x-5">
                <p className='font-semibold text-secondaryColor text-primarySize'>Product Settings:</p>
                <Button variant={"light"} onClick={() => setShowProductConfig(!showProductConfig)} className='px-8 !h-7'>{showProductConfig ? "Hide" : "Show"}</Button>
            </div>
            {
                showProductConfig && <>

                    {/* Lead Dscription */}
                    <div className='text-secondarySize text-tertiaryColor text-justify'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dictum scelerisque rutrum. Mauris consequat cursus sem, eget sodales lorem mollis auctor. Integer commodo lacus risus, vitae porttitor augue viverra quis. Aenean blandit fermentum lorem, id interdum mauris semper quis. Donec consectetur maximus orci, sed facilisis nibh varius in. Vivamus at dui id nibh dignissim sodales. Duis condimentum eu mauris id porta. In dapibus suscipit neque in blandit. Fusce arcu sapien, sagittis ac convallis viverra, faucibus sed justo. Vestibulum eu tincidunt velit, sed vehicula dolor. Sed sed vestibulum lacus. Phasellus ut turpis malesuada lectus laoreet pulvinar at non lacus. Sed volutpat ac purus facilisis malesuada.
                    </div>

                    {/* Lead Keywords */}
                    <div>
                        <p className='font-semibold text-secondaryColor text-primarySize'>Selected Keywords:</p>
                        <div className="flex flex-wrap gap-1.5 w-full overflow-y-auto p-1">
                            {industries.map((item: string, index: number) => (
                                <Badge
                                    key={index}
                                    variant={'leadKeyword'}
                                    className="text-tertiarySize py-0.5 px-2 flex items-center justify-center gap-x-2"
                                >
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </div>

                </>
            }

        </div>
    );
}

"use client";
import { Lead } from '@/types/backend/db';
import {
    BiUpvote,
    BiCommentDetail,
    BiTimeFive,
    BiLinkExternal,
    BiChevronDown,
    BiChevronUp,
} from 'react-icons/bi';
import clsx from 'clsx';
import { Button } from '../button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DialogFooter, DialogHeader } from '../dialog';
import { Badge } from '../badge';
import { useState } from 'react';

interface ProductCardProps {
    leadDetails?: Lead;
    className?: string;
}



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

export default function ProductCard({ className }: ProductCardProps) {
    const [showRedditDescription, setShowRedditDescription] = useState<boolean>(false)
    return (
        <div
            className={clsx(
                'w-auto flex flex-col bg-white text-black p-5 rounded-lg gap-y-4 border border-light',
                className
            )}
        >
            {/* Product Header */}
            <div className='text-bigSize font-semibold text-secondaryColor'>
                KeepSake
            </div>

            {/* Product Description */}
            <div className='text-primarySize text-tertiaryColor text-justify'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dictum scelerisque rutrum. Mauris consequat cursus sem, eget sodales lorem mollis auctor. Integer commodo lacus risus, vitae porttitor augue viverra quis. Aenean blandit fermentum lorem, id interdum mauris semper quis. Donec consectetur maximus orci, sed facilisis nibh varius in. Vivamus at dui id nibh dignissim sodales. Duis condimentum eu mauris id porta. In dapibus suscipit neque in blandit. Fusce arcu sapien, sagittis ac convallis viverra, faucibus sed justo. Vestibulum eu tincidunt velit, sed vehicula dolor. Sed sed vestibulum lacus. Phasellus ut turpis malesuada lectus laoreet pulvinar at non lacus. Sed volutpat ac purus facilisis malesuada.
            </div>

            {/* Keywords Input */}
            <div className='flex flex-col gap-y-2'>
                <label className='text-secondaryColor text-mediumSize font-semibold'>Keywords:</label>
                {/* Keywords List */}
                <div className='flex flex-wrap gap-2 w-full'>
                    {
                        <>
                            {
                                industries.slice(0, 7).map((item: string) => {
                                    return <Badge variant={"leadKeyword"} className='text-xs rounded-lg'>{item}</Badge>
                                })
                            }
                            {
                                industries.length > 7 && <Badge variant={"leadKeyword"} className='text-xs rounded-lg'>+ {industries.length - 7} More</Badge>
                            }

                        </>
                    }
                </div>
            </div>

            {/* Open */}
            <div>
                <Button variant={"dark"}>Open Details</Button>
            </div>
        </div>
    );
}

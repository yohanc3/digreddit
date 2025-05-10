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
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/lib/components/ui/dialog';
import { DialogFooter, DialogHeader } from '../dialog';
import { Badge } from '../badge';
import { useState } from 'react';

interface RedditLeadCardProps {
    leadDetails?: Lead;
    className?: string;
}

export default function RedditLeadCard({ className }: RedditLeadCardProps) {
    const [showRedditDescription, setShowRedditDescription] = useState<boolean>(false)
    return (
        <div
            className={clsx(
                'w-auto flex flex-col bg-white text-black p-3 rounded-lg gap-y-1 border border-light',
                className
            )}
        >
            {/* Card Header */}
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <div className="text-secondaryColor text-primarySize font-semibold">
                        r/Philippines
                    </div>
                    <div className="text-tertiaryColor text-tertiarySize">
                        by: u/jilinjames
                    </div>
                </div>
                <div>
                    <Button variant={"light"}>
                        Open <BiLinkExternal size={18} />
                    </Button>
                </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-col">
                <div className="text-mediumSize font-semibold">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </div>
                <div className="text-tertiarySize text-tertiaryColor text-justify">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    dictum scelerisque rutrum. Mauris consequat cursus sem, eget
                    sodales lorem mollis auctor. Integer commodo lacus risus,
                    vitae porttitor augue viverra quis. Aenean blandit fermentum
                    lorem, id interdum mauris semper quis. Donec consectetur
                    maximus orci, sed facilisis nibh varius in. Vivamus at dui
                    id nibh dignissim sodales. Duis condimentum eu mauris id
                    porta. In dapibus suscipit neque in blandit. Fusce arcu
                    sapien, sagittis ac convallis viverra, faucibus sed justo.
                    Vestibulum eu tincidunt velit, sed vehicula dolor. Sed sed
                    vestibulum lacus. Phasellus ut turpis malesuada lectus
                    laoreet pulvinar at non lacus. Sed volutpat ac purus
                    facilisis malesuada.
                </div>
            </div>

            {/* Reddit Post/Comment Details */}
            <div className="flex flex-row h-10 gap-x-3 items-center">
                <div className="flex flex-row items-center justify-center gap-x-0.5">
                    <BiUpvote color="#D93900" size={18} />{' '}
                    <p className="text-tertiarySize text-tertiaryColor"> 2 </p>
                </div>

                <div className="flex flex-row items-center justify-center gap-x-0.5">
                    <BiCommentDetail color="#344054" size={18} />{' '}
                    <p className="text-tertiarySize text-tertiaryColor"> 2 </p>
                </div>
                <div className="flex flex-row items-center justify-center gap-x-1">
                    <BiTimeFive color="#344054" size={18} />{' '}
                    <p className="text-tertiarySize text-tertiaryColor">
                        {' '}
                        3 Weeks Ago{' '}
                    </p>
                </div>
            </div>

            {/* Card Rating */}
            <div className="flex flex-row items-center text-tertiarySize text-tertiaryColor gap-x-1">
                <p>Lead Rating:</p> <p> 7/10 </p>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"dark"}>Open Details</Button>
                </DialogTrigger>
                <DialogContent className="w-3/6 h-[90%] overflow-y-auto scrollbar-thin">
                    <div className="flex flex-row justify-between h-min">
                        <div className="flex flex-col">

                            {/* Subreddit */}
                            <div className='font-semibold text-mediumSize text-secondaryColor'>r/Philippines</div>

                            {/* Reddit Post Owner */}
                            <div className='text-primarySize text-tertiaryColor'>u/randomguy</div>
                        </div>

                        {/* Lead Rating */}
                        <Badge variant={"dark"}>Rating: 7/10 </Badge>
                    </div>
                    <div className="flex flex-col gap-y-3 h-full justify-between">

                        {/* SubReddit Post Title */}
                        <div className="text-bigSize text-secondaryColor font-semibold text-justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </div>
                        <div className={clsx('w-full relative transition-all duration-500 ease-in-out', showRedditDescription ? "max-h-full" : "max-h-60")}>
                            {
                                !showRedditDescription && <div className='absolute flex h-full w-full items-end justify-center bg-gradient-to-t from-white'>
                                    <div className='flex items-center text-tertiaryColor cursor-pointer' onMouseDown={() => { setShowRedditDescription(true) }}>
                                        <BiChevronDown size={25} /> See More
                                    </div>
                                </div>
                            }

                            {/* Subreddit Post Description */}
                            <div
                                className={"text-primarySize text-tertiaryColor text-justify overflow-y-hidden h-full"}
                            >
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                dictum scelerisque rutrum. Mauris consequat cursus sem, eget
                                sodales lorem mollis auctor. Integer commodo lacus risus,
                                vitae porttitor augue viverra quis. Aenean blandit fermentum
                                lorem, id interdum mauris semper quis. Donec consectetur
                                maximus orci, sed facilisis nibh varius in. Vivamus at dui
                                id nibh dignissim sodales. Duis condimentum eu mauris id
                                porta. In dapibus suscipit neque in blandit. Fusce arcu
                                sapien, sagittis ac convallis viverra, faucibus sed justo.
                                Vestibulum eu tincidunt velit, sed vehicula dolor. Sed sed
                                vestibulum lacus. Phasellus ut turpis malesuada lectus
                                laoreet pulvinar at non lacus. Sed volutpat ac purus
                                facilisis malesuada.

                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                dictum scelerisque rutrum. Mauris consequat cursus sem, eget
                                sodales lorem mollis auctor. Integer commodo lacus risus,
                                vitae porttitor augue viverra quis. Aenean blandit fermentum
                                lorem, id interdum mauris semper quis. Donec consectetur
                                maximus orci, sed facilisis nibh varius in. Vivamus at dui
                                id nibh dignissim sodales. Duis condimentum eu mauris id
                                porta. In dapibus suscipit neque in blandit. Fusce arcu
                                sapien, sagittis ac convallis viverra, faucibus sed justo.
                                Vestibulum eu tincidunt velit, sed vehicula dolor. Sed sed
                                vestibulum lacus. Phasellus ut turpis malesuada lectus
                                laoreet pulvinar at non lacus. Sed volutpat ac purus
                                facilisis malesuada.

                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                dictum scelerisque rutrum. Mauris consequat cursus sem, eget
                                sodales lorem mollis auctor. Integer commodo lacus risus,
                                vitae porttitor augue viverra quis. Aenean blandit fermentum
                                lorem, id interdum mauris semper quis. Donec consectetur
                                maximus orci, sed facilisis nibh varius in. Vivamus at dui
                                id nibh dignissim sodales. Duis condimentum eu mauris id
                                porta. In dapibus suscipit neque in blandit. Fusce arcu
                                sapien, sagittis ac convallis viverra, faucibus sed justo.
                                Vestibulum eu tincidunt velit, sed vehicula dolor. Sed sed
                                vestibulum lacus. Phasellus ut turpis malesuada lectus
                                laoreet pulvinar at non lacus. Sed volutpat ac purus
                                facilisis malesuada.

                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                dictum scelerisque rutrum. Mauris consequat cursus sem, eget
                                sodales lorem mollis auctor. Integer commodo lacus risus,
                                vitae porttitor augue viverra quis. Aenean blandit fermentum
                                lorem, id interdum mauris semper quis. Donec consectetur
                                maximus orci, sed facilisis nibh varius in. Vivamus at dui
                                id nibh dignissim sodales. Duis condimentum eu mauris id
                                porta. In dapibus suscipit neque in blandit. Fusce arcu
                                sapien, sagittis ac convallis viverra, faucibus sed justo.
                                Vestibulum eu tincidunt velit, sed vehicula dolor. Sed sed
                                vestibulum lacus. Phasellus ut turpis malesuada lectus
                                laoreet pulvinar at non lacus. Sed volutpat ac purus
                                facilisis malesuada.
                                {
                                    showRedditDescription && <div className='flex w-full items-center justify-center cursor-pointer' onMouseDown={() => { setShowRedditDescription(false) }}>
                                        <BiChevronUp size={25} /> See Less
                                    </div>
                                }
                            </div>

                        </div>
                        <div className='flex flex-row justify-evenly w-ful gap-x-5'>

                            {/* Subreddit Post Upvotes */}
                            <Badge variant={"leadDetails"}>
                                <div className='items-center justify-center h-min'>
                                    <BiUpvote color="#D93900" size={50} />
                                </div>
                                <div className='items-center justify-center h-min'>
                                    <div className='text-mediumSize text-secondaryColor'>Upvotes</div>
                                    <div className='text-bigSize text-secondaryColor font-semibold'>1.4k</div>
                                </div>
                            </Badge>

                            {/* Subreddit Post Comments */}
                            <Badge variant={"leadDetails"}>
                                <div className='items-center justify-center h-min'>
                                    <BiCommentDetail color="#344054" size={50} />
                                </div>
                                <div className='items-center justify-center h-min'>
                                    <div className='text-mediumSize text-secondaryColor'>Comments</div>
                                    <div className='text-bigSize text-secondaryColor font-semibold'>16</div>
                                </div>
                            </Badge>

                            {/* Subreddit Posted Date */}
                            <Badge variant={"leadDetails"}>
                                <div className='items-center justify-center h-min'>
                                    <BiTimeFive color="#344054" size={50} />
                                </div>
                                <div className='items-center justify-center h-min'>
                                    <div className='text-mediumSize text-secondaryColor'>Posted</div>
                                    <div className='text-bigSize text-secondaryColor font-semibold'>16 Days</div>
                                </div>
                            </Badge>
                        </div>
                        <div className='flex flex-col'>

                             {/* AI Response*/}
                            <label className='text-mediumSize font-semibold text-secondaryColor'>
                                AI Generated Response:
                            </label>
                            <textarea value="Thanks for sharing your thoughts! I really appreciate you bringing this up. It actually ties perfectly into something I wanted to mention — if you're looking for a solution that could help with this, you might want to check out what we're offering.

We've been working hard on a product that's specifically designed to make things easier, faster, and a lot more efficient. It's built around the exact kinds of challenges you're highlighting, and the feedback from early users has been incredibly positive.

I won't go into a full pitch here, but if you're curious, feel free to take a quick look! It could save you a ton of time and effort compared to trying to patch things together manually. Plus, we're always open to feedback — so your input could directly help shape the next improvements we roll out.

No pressure at all — just wanted to share because it feels super relevant to what you're talking about. Let me know if you have any questions or want more details!" placeholder='AI Generated Response . . .' className='border border-light p-2 h-48 text-tertiaryColor text-primarySize' readOnly disabled />
                        </div>
                        <div className='flex justify-end' >
                            <Button variant={"dark"} className='!w-48'>View Comment</Button>
                        </div>
                    </div>
                    {/* <DialogFooter className="sm:justify-start">
                    </DialogFooter> */}
                </DialogContent>
            </Dialog>
        </div>
    );
}

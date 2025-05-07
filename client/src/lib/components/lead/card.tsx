import { Lead } from '@/types/backend/db';
import {
    BiUpvote,
    BiCommentDetail,
    BiTimeFive,
    BiLinkExternal,
} from 'react-icons/bi';
import clsx from 'clsx';
import LightButton from '../button/light';
import DarkButton from '../button/dark';

interface RedditLeadCardProps {
    leadDetails?: Lead;
    className?: string;
}

export default function RedditLeadCard({ className }: RedditLeadCardProps) {
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
                    <LightButton
                        title="Open"
                        className="text-xs !px-2"
                        RightIcon={<BiLinkExternal size={18} />}
                    />
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

            <DarkButton title="Open Details" className="w-full" />
        </div>
    );
}

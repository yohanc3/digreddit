import { BiChevronsLeft, BiPlus, BiTrash } from 'react-icons/bi';
import clsx from 'clsx';
import { Button } from '../button';
import RedditLeadList from './list';

interface LeftSideBarLeadResultProps {
    className?: string;
}

interface RightSideBarLeadResultProps {
    className?: string;
}

export function LeftSideBarLeadResult({
    className,
}: LeftSideBarLeadResultProps) {
    return (
        <div
            className={clsx(
                'h-screen w-1/6 bg-white border border-light border-t-0 text-secondarySize font-normal px-2',
                className
            )}
        >
            <div className="flex justify-end">
                <BiChevronsLeft color="#576F72" size={24} />
            </div>
            <p className="text-secondarySize text-secondaryColor">Results:</p>
            <RedditLeadList />
        </div>
    );
}

export function RightSideBarLeadResult({
    className,
}: RightSideBarLeadResultProps) {
    return (
        <div
            className={clsx(
                'h-screen w-1/6 flex flex-col bg-white border border-light border-t-0 text-secondarySize font-normal px-3 pt-6 gap-y-1',
                className
            )}
        >
            <Button variant={"dark"} className='!justify-between w-full'>
                Create New Request <BiPlus size={20} />
            </Button>
            <Button variant={"lightDelete"}>
                Delete Results <BiTrash size={20} />
            </Button>
        </div>
    );
}

import { BiChevronsLeft, BiPlus, BiTrash } from "react-icons/bi";
import clsx from "clsx";
import LightButton from "../button/light";
import DarkButton from "../button/dark";
import RedditLeadListItem from "./item";
import RedditLeadList from "./list";

interface LeftSideBarLeadResultProps {
    className?: string;
}

interface RightSideBarLeadResultProps {
    className?: string;
}

export function LeftSideBarLeadResult({
    className
}: LeftSideBarLeadResultProps) {
    return (
        <div className={clsx(
            "h-screen w-1/6 bg-white border border-light border-t-0 text-secondarySize font-normal px-2",
            className
        )}>
            <div className="flex justify-end">
                <BiChevronsLeft color="#576F72" size={24} />
            </div>
            <p className="text-secondarySize text-secondaryColor">Results:</p>
            <RedditLeadList />
        </div>
    );
}

export function RightSideBarLeadResult({
    className
}: RightSideBarLeadResultProps) {
    return (
        <div className={clsx(
            "h-screen w-1/6 flex flex-col bg-white text-secondarySize font-normal px-3 mt-6 gap-y-1",
            className
        )}>
            <DarkButton title="Create New Request" RightIcon={<BiPlus size={24}/>} className="w-full !justify-between" />
            <LightButton title="Delete Results" RightIcon={<BiTrash size={24}/>}className="w-full justify-between text-red-400 hover:bg-red-400 hover:text-white" />
        </div>
    );
}
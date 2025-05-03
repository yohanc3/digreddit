import { Lead } from "@/types/backend/db";
import { BiUpvote, BiDownvote, BiCommentDetail, BiTimeFive, BiStar, BiLinkExternal } from "react-icons/bi";
import clsx from "clsx";
import LightButton from "../button/light";
import DarkButton from "../button/dark";
import DashboardNavItems from "./DashboardNavItems";

interface NavBarProps {
    className?: string;
}

export default function NavBar({
    className
}: NavBarProps) {
    return (
        <div className={clsx(
            "w-full flex border border-light px-3 py-2 justify-center",
            className
        )}>
            <div className="w-2/3 flex justify-between">
                <div className="flex flex-row justify-center items-center gap-x-7">
                    <p className="font-bold text-2xl text-primaryColor">DigReddit</p>
                    <DashboardNavItems />
                </div>

                {/* Temporary Profile */}
                <div className="flex flex-row items-center gap-x-2">
                    <img className="h-10 rounded-full w-8 h-8" src="https://picsum.photos/200" alt="Profile Image" />
                    <p className="text-primarySize text-secondaryColor font-semibold">Bob Alen Smith</p>
                </div>
            </div>
        </div>
    );
}

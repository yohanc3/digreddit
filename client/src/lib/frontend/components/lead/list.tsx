import { BiChevronsLeft } from "react-icons/bi";
import clsx from "clsx";
import LightButton from "../button/light";
import DarkButton from "../button/dark";
import RedditLeadListItem from "./item";

interface RedditLeadListProps {
    className?: string;
}

export default function RedditLeadList({
    className
}: RedditLeadListProps) {
    return (
        <div className={clsx(
            "h-1/2 text-secondarySize font-normal",
            className
        )}>
            <RedditLeadListItem />
            <RedditLeadListItem />
            <RedditLeadListItem />
            <RedditLeadListItem />
            <RedditLeadListItem />
            <RedditLeadListItem />
        </div>
    );
}

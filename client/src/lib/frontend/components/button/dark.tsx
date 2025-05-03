import clsx from "clsx";
import { ReactNode } from "react";

interface DarkButtonProps {
    title: string;
    onClick?: ()=>void;
    LeftIcon?: ReactNode;
    RightIcon?: ReactNode
    className?: string;
}

export default function DarkButton({
    title,
    LeftIcon,
    RightIcon,
    className
}: DarkButtonProps) {
    return (
        <button className={clsx(
            "flex flex-row items-center justify-center font-semibold bg-primaryColor text-primarySize text-white border rounded-md border-light py-2 px-5 gap-x-2 hover:bg-primaryColor/20 hover:border-light hover:text-primaryColor transition-all duration-200 ease-in-out",
            className
        )}>
            {LeftIcon}
            {title}
            {RightIcon}
        </button>
    );
}

import clsx from 'clsx';
import { ReactNode } from 'react';

interface LightButtonProps {
    title: string;
    onClick?: () => void;
    LeftIcon?: ReactNode;
    RightIcon?: ReactNode;
    className?: string;
    children?: JSX.Element | string
}

export default function LightButton({
    title,
    LeftIcon,
    RightIcon,
    className,
    children
}: LightButtonProps) {
    return (
        <button
            className={clsx(
                'flex flex-row items-center justify-between font-semibold bg-white text-primarySize text-primaryColor border rounded-md border-light hover:bg-primaryColor/20 py-2 px-5 gap-x-2 transition-all duration-200 ease-in-out',
                className
            )}
        >
            {LeftIcon}
            {title}
            {RightIcon}
            {children}
        </button>
    );
}

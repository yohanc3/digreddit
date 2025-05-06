import clsx from 'clsx';

interface RedditLeadListItemProps {
    className?: string;
}

export default function RedditLeadListItem({
    className,
}: RedditLeadListItemProps) {
    return (
        <div
            className={clsx(
                'w-full flex flex-col bg-white text-black px-3 py-2 rounded-lg hover:bg-primaryColor/20 transition-all duration-200 ease-in-out',
                className
            )}
        >
            <p className="text-primarySize text-secondaryColor font-semibold">
                Keepsake Leads Result
            </p>
            <p className="text-tertiarySize text-tertiaryColor">
                December 01, 2025
            </p>
        </div>
    );
}

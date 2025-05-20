import clsx from 'clsx';

interface RedditLeadListItemProps {
    className?: string;
    title: string;
    date: string;
}

export default function RedditLeadListItem({
    className,
    title,
    date,
}: RedditLeadListItemProps) {
    return (
        <div
            className={clsx(
                className,
                'w-full flex flex-col text-black px-3 py-2 rounded-lg hover:bg-primaryColor/20 transition-all duration-200 ease-in-out'
            )}
        >
            <p className="text-primarySize text-secondaryColor font-semibold">
                {title}
            </p>
            <p className="text-tertiarySize text-tertiaryColor">
                Started At: {date}
            </p>
        </div>
    );
}

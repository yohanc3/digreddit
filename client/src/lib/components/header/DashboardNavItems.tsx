import clsx from 'clsx';
import LightButton from '../button/light';

interface DashboardNavItemsProps {
    className?: string;
}

export default function DashboardNavItems({
    className,
}: DashboardNavItemsProps) {
    return (
        <div
            className={clsx(
                'flex flex-row gap-x-2 items-center justify-center',
                className
            )}
        >
            <LightButton
                title="Dashboard"
                className="border-0 text-secondaryColor text-sm"
            />
            <LightButton
                title="Your Products"
                className="border-0 text-secondaryColor text-sm"
            />
        </div>
    );
}

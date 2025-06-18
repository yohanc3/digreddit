import clsx from 'clsx';
import DashboardNavItems from './DashboardNavItems';
import { auth } from '../../../../../auth';
import { redirect } from 'next/navigation';
import { UserDropdown } from '@/lib/components/avatar-dropdown';
import { FullLogo } from '../../logo';
import RedditConnection from './RedditConnection';

interface NavBarProps {
    className?: string;
}

export default async function NavBar({ className }: NavBarProps) {
    const session = await auth();

    if (!session || !session.user) return redirect('/');

    return (
        <div
            className={clsx(
                'w-full flex border border-light px-3 py-2',
                className
            )}
        >
            {/* Logo - Far Left */}
            <div className="flex items-center">
                <p className="font-bold text-2xl text-primaryColor">
                    <FullLogo />
                </p>
            </div>

            {/* Navigation Items - Centered */}
            <div className="flex-1 flex justify-center items-center">
                <DashboardNavItems />
            </div>

            {/* User Profile - Far Right */}
            <div className="flex flex-row items-center gap-x-2">
                <RedditConnection />
                <div className="flex flex-row items-center gap-x-2">
                    <UserDropdown user={session.user} />
                    <p className="text-primarySize text-secondaryColor font-semibold">
                        {session.user?.name || ''}
                    </p>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Button } from '../button';
import { navigationItems } from '@/lib/frontend/constant/navigation';
import { toPascalCasePreserveSymbols } from '@/lib/utils';

interface DashboardNavItemsProps {
    className?: string;
}

export default function DashboardNavItems({
    className,
}: DashboardNavItemsProps) {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <div
            className={clsx(
                'flex flex-row gap-x-2 items-center justify-center',
                className
            )}
        >
            {navigationItems.map((item: string, index: number) => {
                const path = item.split(' ').join('-');
                const displayName = toPascalCasePreserveSymbols(item);
                return (
                    <Button
                        key={index}
                        onClick={() => router.push(`/${path}`)}
                        variant={'light'}
                        className={clsx(
                            'border-0 !text-primaryColor',
                            pathname === `/${path}` && 'bg-primaryColor/20'
                        )}
                    >
                        {displayName}
                    </Button>
                );
            })}
        </div>
    );
}

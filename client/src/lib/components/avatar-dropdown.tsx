import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/lib/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/lib/components/ui/dropdown-menu';
import { ChevronRight } from 'lucide-react';
import type { User } from 'next-auth';
import { signOut } from '../../../auth';

export function UserDropdown({ user }: { user: User }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarImage src={user.image || ''} />
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                        N/A
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-72 bg-white text-gray-800 border-gray-200"
                align="end"
            >
                <div className="flex items-center gap-3 p-3">
                    <Avatar>
                        <AvatarImage src={user.image || ''} />
                        <AvatarFallback className="bg-gray-200 text-gray-700">
                            NA
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-gray-800 font-medium">
                            {user.name}
                        </span>
                        <span className="text-gray-500 text-sm">
                            {user.email}
                        </span>
                    </div>
                </div>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="py-3 text-gray-800 hover:bg-gray-100 focus:bg-gray-100">
                    Account settings
                </DropdownMenuItem>
                <DropdownMenuItem className="py-3 text-gray-800 hover:bg-gray-100 focus:bg-gray-100 flex justify-between items-center">
                    <span>Theme: System</span>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                </DropdownMenuItem>
                <DropdownMenuItem className="py-3 text-gray-800 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer">
                    <form
                        action={async () => {
                            'use server';

                            await signOut({ redirectTo: '/' });
                        }}
                    >
                        <button type="submit">Sign Out</button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

import NavBar from '@/lib/components/ui/header/NavBar';
import {
    LeftSideBarLeadResult,
    RightSideBarLeadResult,
} from '@/lib/components/ui/lead/sidebar';

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col w-full">
            <NavBar />
            <div className="h-full w-full flex justify-center">
                {children}
            </div>
        </div>
    );
}

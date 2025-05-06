import NavBar from '@/lib/components/header/NavBar';
import {
    LeftSideBarLeadResult,
    RightSideBarLeadResult,
} from '@/lib/components/lead/sidebar';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col w-full">
            <NavBar />
            <div className="h-full flex flex-row">
                <LeftSideBarLeadResult />
                {children}
                <RightSideBarLeadResult />
            </div>
        </div>
    );
}

import NavBar from "@/lib/frontend/components/header/NavBar";
import RedditLeadList from "@/lib/frontend/components/lead/list";
import { LeftSideBarLeadResult, RightSideBarLeadResult } from "@/lib/frontend/components/lead/sidebar";

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

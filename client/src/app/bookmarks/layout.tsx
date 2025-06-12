import NavBar from '@/lib/components/ui/header/NavBar';

export default function BookmarkPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col w-full">
            <NavBar />
            <div className="h-full flex flex-row">
                {children}
            </div>
        </div>
    );
}

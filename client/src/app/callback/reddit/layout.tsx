import NavBar from '@/lib/components/ui/header/NavBar';

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col w-full h-screen">
            <NavBar />
            <div className="h-full flex flex-row flex-grow">
                {children}
            </div>
        </div>
    );
}

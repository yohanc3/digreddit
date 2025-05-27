import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Providers from './providers';
import { Toaster } from '@/lib/components/ui/toaster';

const poppins = Poppins({
    subsets: ['latin'], // You can add more subsets if you want
    weight: ['300', '400', '500', '600', '700'], // Which weights you want to use
    variable: '--font-poppins', // 👈 This sets it as a CSS variable
    display: 'swap', // Better performance
});

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'DigReddit',
    description: 'DigReddit helps you find the best Reddit leads in real time.',
    icons: {
        icon: '/favicons/favicon.ico',
        16: '/favicons/favicon-16x16.png',
        32: '/favicons/favicon-32x32.png',
        64: '/favicons/favicon-64x64.png',
        512: '/favicons/favicon-512x512.png',
        1024: '/favicons/favicon-1024x1024.png',
        apple: '/favicons/apple-touch-icon.png',
    },
    openGraph: {
        title: 'DigReddit',
        description:
            'DigReddit helps you find the best Reddit leads in real time.',
        images: [
            '/favicons/favicon.ico',
            '/favicons/favicon-32x32.png',
            '/favicons/favicon-512x512.png',
            '/favicons/favicon-64x64.png',
            '/favicons/favicon-16x16.png',
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DigReddit',
        description:
            'DigReddit helps you find the best Reddit leads for your business in real time.',
        images: ['/favicons/favicon.ico'],
        site: 'https://digreddit.com',
        creator: '@yohanc33',
    },
    keywords: [
        'DigReddit',
        'Reddit',
        'Leads',
        'Real Time Scraper',
        'Scraper',
        'Leads Scraper',
    ],
    metadataBase: new URL('https://digreddit.com'),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${poppins.variable} antialiased font-poppins bg-white`}
            >
                <Providers>{children}</Providers>
                <Toaster />
            </body>
        </html>
    );
}

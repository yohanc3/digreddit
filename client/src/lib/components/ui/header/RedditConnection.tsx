'use client';
import { useRedditUser } from '@/lib/frontend/hooks/useRedditUser';
import Image from 'next/image';
import { useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RedditConnection() {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { redditUserData, isRedditUserDataLoading } = useRedditUser();
    const [buttonContent, setButtonContent] = useState<string>('Connecting');
    const state = searchParams.get('state');
    const code = searchParams.get('code');

    useEffect(() => {
        if (state && code && pathName === '/callback/reddit') {
            setButtonContent('Connecting');
            return;
        } else if (isRedditUserDataLoading) {
            setButtonContent('Connecting');
            return;
        } else if (!isRedditUserDataLoading && !redditUserData) {
            setButtonContent('Not Connected');
            return;
        } else if (redditUserData) {
            setButtonContent(`r/${redditUserData.name}`);
            return;
        }
    }, [state, code, pathName, redditUserData, isRedditUserDataLoading]);

    return (
        <button
            className={`flex ${redditUserData && !isRedditUserDataLoading && 'bg-[#dcffd4a6]'} flex-row gap-x-2 py-1 pl-2 pr-3  border rounded-full items-center hover:opacity-100 max-w-2xl ml-2`}
            onClick={() => {
                if (buttonContent === 'Not Connected')
                    window.location.href = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID}&response_type=code&state=random&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/callback/reddit&duration=permanent&scope=identity,submit`;
            }}
        >
            <Image
                src={redditUserData?.snoovatar_img || '/reddit.png'}
                alt="Picture of the author"
                width={100}
                height={100}
                className="h-7 w-7 rounded-full object-cover"
            />
            <div className="flex font-semibold text-nowrap text-xs !text-secondaryColor w-auto">
                {buttonContent}
            </div>
        </button>
    );
}

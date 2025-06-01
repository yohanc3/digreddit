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
            className={`flex ${redditUserData && !isRedditUserDataLoading && 'bg-[#dcffd4a6]'} flex-row gap-x-2 p-1 border rounded-full items-center hover:opacity-100`}
            onClick={() => {
                if (buttonContent === 'Not Connected')
                    window.location.href = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID}&response_type=code&state=random&redirect_uri=http://localhost:3000/callback/reddit&duration=permanent&scope=identity,submit`;
            }}
        >
            <Image
                src={redditUserData?.snoovatar_img || '/reddit.png'}
                alt="Picture of the author"
                width={100}
                height={100}
                className="h-10 w-10 rounded-full object-cover"
            />
            <div className="font-semibold text-primarySize !text-secondaryColor pr-2">
                {buttonContent}
            </div>
        </button>
    );
}

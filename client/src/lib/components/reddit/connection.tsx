"use client";
import { useRedditConnectionAuth } from '@/lib/frontend/hooks/useRedditConnectionAuth';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function RedditConnectionPage() {
    const [connectionMessage, setConnectionMessage] = useState("");
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const { redditConnectionAuthData, isRedditConnectionAuthDataLoading } = useRedditConnectionAuth(code)

    useEffect(()=>{
        if(redditConnectionAuthData){
            setConnectionMessage("Connected Successfully. Redirecting you back to Dashboard")
        }else if(isRedditConnectionAuthDataLoading){
            setConnectionMessage("Connecting Your Reddit Account. Please Wait")
        }else{
            setConnectionMessage("Something went wrong")
        }
    },[isRedditConnectionAuthDataLoading, redditConnectionAuthData])

    return (
        <div className={`flex flex-col gap-4 items-center justify-center w-full h-full -pt-10 ${isRedditConnectionAuthDataLoading && "animate-pulse"}`}>
            <Image src="/reddit.png" width={150} height={150} alt="Reddit Logo"/>
            <div className='text-bigSize font-semibold'>
                {connectionMessage}
            </div>
        </div>
    )
}
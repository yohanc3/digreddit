"use client";
import { useQuery } from '@tanstack/react-query';
import { useFetch } from './useFetch';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function useRedditConnectionAuth(code: string | null) {
    const { apiGet } = useFetch();
    const router = useRouter()
    
    const { data: redditConnectionAuthData, isLoading: isRedditConnectionAuthDataLoading } =
        useQuery({
            queryKey: ['userRedditAuth', code],
            queryFn: async () => {
                try {
                    if (!code) return null;
                    const result = await apiGet(`api/reddit/auth?code=${code}`);
                    localStorage.setItem("reddit_access_token", result.message.access_token);
                    router.push("/dashboard")
                    return true
                } catch (e) {
                    toast({
                        variant: "destructive",
                        title: 'Error',
                        description: 'Something went wrong when fetching your Reddit Data'
                    });
                    console.error('Error when fetching user reddit data', e);
                    return false
                }
            },
            enabled: !!code,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: Infinity,

        });

    return {
        redditConnectionAuthData,
        isRedditConnectionAuthDataLoading,
    };
}

import { useQuery } from '@tanstack/react-query';
import { useFetch } from './useFetch';
import { userQueries } from '@/db';

export function useRedditUser() {
    const { apiPost } = useFetch()
    const { data: redditUserData, isLoading: isRedditUserDataLoading } =
        useQuery({
            queryKey: ['userRedditDetails'],
            queryFn: async () => {
                try {
                    const access_token = localStorage.getItem('reddit_access_token')
                    const redditUser = await apiPost("api/reddit/me", { access_token })

                    // Note from Adriel:
                    // This if condition handles the case where the original access_token passed to api/reddit/me
                    // is either expired or invalid. If that happens, the backend will attempt to refresh the token
                    // using the stored refresh_token and return a new access_token in the response.
                    // If a new access_token is present in the response, we store it in localStorage
                    // to ensure future requests remain authenticated.
                    if (redditUser.access_token) localStorage.setItem('reddit_access_token', redditUser.access_token)


                    return redditUser
                } catch (error) {
                    return null
                }
            },
        });

    return {
        redditUserData,
        isRedditUserDataLoading,
    };
}

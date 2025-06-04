import { useQuery } from '@tanstack/react-query';
import { useFetch } from './useFetch';
import { userQueries } from '@/db';
import { getBrowserRedditAccessToken } from '../utils/getRedditOauthToken';

export function useRedditUser() {
    const { apiPost } = useFetch();
    const { data: redditUserData, isLoading: isRedditUserDataLoading } =
        useQuery({
            queryKey: ['userRedditDetails'],
            queryFn: async () => {
                try {
                    const accessToken = getBrowserRedditAccessToken();

                    const redditUser = await apiPost('api/reddit/me', {
                        accessToken,
                    });

                    // Note from Adriel:
                    // This if condition handles the case where the original access_token passed to api/reddit/me
                    // is either expired or invalid. If that happens, the backend will attempt to refresh the token
                    // using the stored refresh_token and return a new access_token in the response.
                    // If a new access_token is present in the response, we store it in localStorage
                    // to ensure future requests remain authenticated.
                    if (redditUser.accessToken) {
                        localStorage.setItem(
                            'reddit_access_token',
                            redditUser.accessToken
                        );
                    }

                    return redditUser;
                } catch (error) {
                    return null;
                }
            },
        });

    return {
        redditUserData,
        isRedditUserDataLoading,
    };
}

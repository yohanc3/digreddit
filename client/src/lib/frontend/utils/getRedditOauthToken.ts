export const getBrowserRedditAccessToken = () => {
    const accessToken = localStorage.getItem('reddit_access_token');
    return accessToken;
};

export type Lead = {
    id: string;
    subreddit: string;
    title: string;
    author: string;
    body: string;
    createdAt: Number;
    ups: Number;
    downs: Number;
    numComments: Number;
    url: string;
    subreddditSubscribers: Number;
    over18: boolean;
    requestId: string;
    rating: Number;
    aiResponse: string;
}
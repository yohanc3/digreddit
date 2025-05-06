export type Lead = {
    id: string;
    subreddit: string;
    author: string;
    body: string;
    createdAt: number;
    ups: number;
    downs: number;
    url: string;
};

export type PostLead = Lead & {
    title: string;
    numComments: number;
    subreddditSubscribers: number;
    over18: boolean;
    requestId: string;
    rating: number;
    aiResponse: string;
};

export type CommentLead = Lead & {};

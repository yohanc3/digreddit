export interface Post {
	id: string;
	subreddit: string;
	title: string;
	author: string;
	body: string;
	createdAt: number;
	ups: number;
	downs: number;
	numComments: number;
	url: string;
	subredditSubscribers: number;
	over18: boolean;
}

export interface Comment {
    id: string;
    subreddit: string;
    author: string;
    body: string;
    createdAt: string;
    ups: number;
    downs: number;
    url: string

}

export function sanitizePosts(rawPosts) {
    return rawPosts
        .filter(
            (rawPost) =>
                rawPost.data.is_video === false &&
                rawPost.data.selftext.length > 0 &&
                rawPost.data.selftext.length < 1000 &&
                rawPost.data.selftext !== '[removed]'
        )
        .map((rawPost, index) => {
            const rawPostData = rawPost.data

            return {
                id: rawPostData.id,
                subreddit: rawPostData.subreddit_name_prefixed,
                title: rawPostData.title,
                author: rawPostData.author,
                body: rawPostData.selftext,
                createdAt: rawPostData.created,
                ups: rawPostData.ups,
                downs: rawPostData.downs,
                num_comments: rawPostData.num_comments,
                url: rawPostData.url,
                subredditSubscribers: rawPostData.subreddit_subscribers,
                over18: rawPostData.over_18,
            }
        })
}

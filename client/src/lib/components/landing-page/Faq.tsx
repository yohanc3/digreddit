export default function Faq() {
    const faqs = [
        {
            question: 'How do you define a lead?',
            answer: 'We define a lead as a Reddit post or comment that matches your specified keywords, indicating the user may be interested in your product or service. Each lead includes the post/comment content, a rating (calculated by good of a lead it makes for you), and information like upvotes, creation date, subreddit, etc.',
        },
        {
            question: 'Can I customize keywords or industries?',
            answer: "Yes! You can always customize your Product's attributes such as, title, description, mrr, industry, keywords, and so.",
        },
        {
            question: 'What if Reddit bans scraping?',
            answer: "We use Reddit's official API and comply with all their terms of service. Our system is designed to be respectful of rate limits and other restrictions to ensure long-term reliability of the service.",
        },
        {
            question: 'How fresh are the leads?',
            answer: 'Our system scans Reddit in near real-time. Most leads are delivered within 15 to 30 seconds of being posted on Reddit, giving you the opportunity to be one of the first to respond.',
        },
        {
            question: 'Can I get notifications?',
            answer: 'Yes! You can receive email notifications for new leads. You can set how often you want to receive email notifications.',
        },
    ];

    return (
        <section id="faq" className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-16">
                    Frequently Asked Questions
                </h2>
                <div className="max-w-3xl mx-auto space-y-8">
                    {faqs.map((item, index) => (
                        <div key={index} className="border-b pb-6">
                            <h3 className="text-xl font-semibold mb-3">
                                {item.question}
                            </h3>
                            <p className="text-gray-600">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

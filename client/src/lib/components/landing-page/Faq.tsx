import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/lib/components/ui/card';

export default function FAQ() {
    const faqs = [
        {
            question: 'How do you define a lead?',

            answer: 'We define a lead as a Reddit post or comment that matches your specified keywords, indicating the user may be interested in your product or service. Each lead includes the post/comment content, a quality rating (1-10), and metadata like upvotes, creation date, subreddit, etc.',
        },
        {
            question: 'Can I customize keywords or industries?',
            answer: "Yes! You can fully customize your product's attributes including title, description, MRR, industry, keywords, and more. Our AI learns from your preferences to improve lead quality over time.",
        },
        {
            question: 'What if Reddit changes their API or bans scraping?',
            answer: "We use Reddit's official API and comply with all their terms of service. Our system is designed to respect rate limits and other restrictions to ensure long-term reliability. We also have backup systems in place.",
        },
        {
            question: 'How fresh are the leads?',
            answer: 'Our system scans Reddit in near real-time. Most leads are delivered within 15-30 seconds of being posted on Reddit, giving you the opportunity to be one of the first to respond and engage.',
        },
        {
            question: 'Can I get notifications for new leads?',
            answer: 'Yes! You can receive email notifications, Slack alerts, or webhook notifications for new leads. You can customize notification frequency and set minimum quality scores for alerts.',
        },
    ];

    return (
        <section id="faq" className="bg-gray-50 py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need to know about DigReddit
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-8">
                    {faqs.map((faq, index) => (
                        <Card key={index} className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-left text-lg">
                                    {faq.question}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">{faq.answer}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

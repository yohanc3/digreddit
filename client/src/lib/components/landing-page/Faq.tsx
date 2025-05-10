export default function Faq() {
    const faqs = [
      {
        question: "How do you define a lead?",
        answer:
          "We define a lead as a Reddit post or comment that matches your specified keywords or semantic criteria, indicating the user may be interested in your product or service. Each lead includes the post content, user information (if public), and relevance score.",
      },
      {
        question: "Can I customize keywords or industries?",
        answer:
          "Yes! All plans allow you to customize your keywords. The Starter and Pro plans offer more advanced customization options, including industry-specific templates and semantic matching to catch leads even when they don't use your exact keywords.",
      },
      {
        question: "What if Reddit bans scraping?",
        answer:
          "We use Reddit's official API and comply with all their terms of service. Our system is designed to be respectful of rate limits and other restrictions to ensure long-term reliability of the service.",
      },
      {
        question: "How fresh are the leads?",
        answer:
          "Our system scans Reddit in near real-time. Most leads are delivered within 15 minutes of being posted on Reddit, giving you the opportunity to be one of the first to respond.",
      },
      {
        question: "Can I get notifications?",
        answer:
          "Yes! You can receive email notifications for new leads, or set up webhook integrations (Pro plan) to connect with your existing tools like Slack, Discord, or your CRM system.",
      },
    ]
  
    return (
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {faqs.map((item, index) => (
              <div key={index} className="border-b pb-6">
                <h3 className="text-xl font-semibold mb-3">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
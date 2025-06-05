import { Button } from '@/lib/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/lib/components/ui/card';
import { Input } from '@/lib/components/ui/input';
import { Badge } from '@/lib/components/ui/badge';
import {
    Search,
    Filter,
    MessageSquare,
    ArrowRight,
    Menu,
    Clock,
    Target,
    Zap,
    CheckCircle,
    TrendingUp,
    Users,
    Globe,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#576F72] to-[#344054] rounded-lg flex items-center justify-center">
                                <Search className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                DigReddit
                            </span>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="#how-it-works"
                            className="text-sm font-medium hover:text-[#576F72] transition-colors"
                        >
                            How It Works
                        </Link>
                        <Link
                            href="#who-its-for"
                            className="text-sm font-medium hover:text-[#576F72] transition-colors"
                        >
                            Who It's For
                        </Link>
                        <Link
                            href="#faq"
                            className="text-sm font-medium hover:text-[#576F72] transition-colors"
                        >
                            FAQ
                        </Link>
                        <Link
                            href="#contact"
                            className="text-sm font-medium hover:text-[#576F72] transition-colors"
                        >
                            Contact
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link
                            href="#"
                            className="hidden md:block text-sm font-medium hover:text-[#576F72] transition-colors"
                        >
                            Sign In
                        </Link>
                        <Button className="bg-gradient-to-r from-[#576F72] to-[#344054] hover:from-[#4a5f62] hover:to-[#2d3648] text-white">
                            Get Started
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto py-16 px-4 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <Badge
                                className="bg-[#576F72]/10 text-[#576F72] text-xs hover:bg-[#576F72]/20 w-fit h-4 px-2 font-semibold"
                                variant="default"
                            >
                                🚀 Real-time Reddit Lead Generation
                            </Badge>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                                Turn Reddit Conversations Into{' '}
                                <span className="bg-gradient-to-r from-[#576F72] to-[#344054] bg-clip-text text-transparent">
                                    Hot Leads
                                </span>{' '}
                                — In Real Time
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                DigReddit scans every new post and comment on
                                Reddit to uncover valuable leads tailored to
                                your business. Get notified instantly when
                                potential customers mention problems your
                                product solves.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-[#576F72] to-[#344054] hover:from-[#4a5f62] hover:to-[#2d3648] text-white"
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-[#576F72] text-[#576F72] hover:bg-[#576F72]/5"
                            >
                                Watch Demo
                            </Button>
                        </div>

                        <div className="flex items-center gap-8 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>14-day free trial</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border">
                            <Image
                                src="/placeholder.svg?height=500&width=600"
                                alt="DigReddit Dashboard"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#576F72]/10 to-[#344054]/10"></div>
                        </div>

                        {/* Floating Stats Cards */}
                        <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 border">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">
                                    Live Scanning
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                2,847 posts scanned
                            </p>
                        </div>

                        <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 border">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-[#576F72]" />
                                <span className="text-sm font-medium">
                                    Hot Lead
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                95% match score
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-[#576F72] mb-2">
                                2M+
                            </div>
                            <p className="text-gray-600">Posts Scanned Daily</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-[#576F72] mb-2">
                                15s
                            </div>
                            <p className="text-gray-600">
                                Average Lead Delivery
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-[#576F72] mb-2">
                                94%
                            </div>
                            <p className="text-gray-600">Lead Accuracy Rate</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-[#576F72] mb-2">
                                500+
                            </div>
                            <p className="text-gray-600">Active Users</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Our AI-powered system monitors Reddit 24/7 to find
                            the perfect leads for your business
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="relative overflow-hidden border-0 shadow-lg">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#576F72] to-[#344054]"></div>
                            <CardHeader className="text-center pb-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#576F72] to-[#344054] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-xl">
                                    Real-Time Scanning
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-gray-600">
                                    We scan every Reddit post & comment in
                                    real-time across all subreddits, processing
                                    millions of conversations daily.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden border-0 shadow-lg">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#576F72] to-[#344054]"></div>
                            <CardHeader className="text-center pb-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#576F72] to-[#344054] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Filter className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-xl">
                                    Smart Matching
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-gray-600">
                                    Our AI matches posts and comments based on
                                    your product keywords, target audience, and
                                    business context with 94% accuracy.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden border-0 shadow-lg">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#576F72] to-[#344054]"></div>
                            <CardHeader className="text-center pb-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#576F72] to-[#344054] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-xl">
                                    Instant Delivery
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-gray-600">
                                    Get qualified leads delivered to your
                                    dashboard and email within 15-30 seconds, so
                                    you can be first to respond.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Who It's For */}
            <section id="who-its-for" className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Perfect For Growing Businesses
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Whether you're a startup or established company,
                            DigReddit helps you find customers where they're
                            already talking
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-[#576F72]/10 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="h-6 w-6 text-[#576F72]" />
                                </div>
                                <CardTitle>SaaS Founders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Find users discussing problems your software
                                    solves. Perfect for product validation and
                                    customer acquisition.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-[#576F72]/10 rounded-lg flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-[#576F72]" />
                                </div>
                                <CardTitle>Marketing Agencies</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Scale your client acquisition by monitoring
                                    conversations about their industry and
                                    competitors.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-[#576F72]/10 rounded-lg flex items-center justify-center mb-4">
                                    <Target className="h-6 w-6 text-[#576F72]" />
                                </div>
                                <CardTitle>Sales Teams</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Identify warm prospects who are actively
                                    seeking solutions you provide, increasing
                                    conversion rates.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-[#576F72]/10 rounded-lg flex items-center justify-center mb-4">
                                    <Globe className="h-6 w-6 text-[#576F72]" />
                                </div>
                                <CardTitle>E-commerce Brands</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Discover customers looking for products like
                                    yours and engage them before your
                                    competitors do.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-[#576F72]/10 rounded-lg flex items-center justify-center mb-4">
                                    <TrendingUp className="h-6 w-6 text-[#576F72]" />
                                </div>
                                <CardTitle>Growth Hackers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Automate lead generation and focus on what
                                    matters most - converting prospects into
                                    customers.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-[#576F72]/10 rounded-lg flex items-center justify-center mb-4">
                                    <Clock className="h-6 w-6 text-[#576F72]" />
                                </div>
                                <CardTitle>Consultants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Find businesses discussing challenges in
                                    your expertise area and offer your
                                    consulting services.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features Highlight */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Advanced Lead Scoring & Analytics
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">
                                Not all leads are created equal. Our AI analyzes
                                context, sentiment, and engagement to give you a
                                quality score for every lead.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 bg-gradient-to-r from-[#576F72] to-[#344054] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle className="h-3 w-3 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Smart Lead Scoring
                                        </h3>
                                        <p className="text-gray-600">
                                            Each lead gets a 1-10 quality score
                                            based on relevance and buying intent
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 bg-gradient-to-r from-[#576F72] to-[#344054] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle className="h-3 w-3 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Sentiment Analysis
                                        </h3>
                                        <p className="text-gray-600">
                                            Understand the emotional context
                                            behind each mention
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 bg-gradient-to-r from-[#576F72] to-[#344054] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle className="h-3 w-3 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Engagement Metrics
                                        </h3>
                                        <p className="text-gray-600">
                                            See upvotes, comments, and post
                                            popularity at a glance
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <Image
                                src="/placeholder.svg?height=400&width=500"
                                alt="Lead Scoring Dashboard"
                                width={500}
                                height={400}
                                className="rounded-2xl shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
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
                        {[
                            {
                                question: 'How do you define a lead?',
                                answer: 'We define a lead as a Reddit post or comment that matches your specified keywords, indicating the user may be interested in your product or service. Each lead includes the post/comment content, a quality rating (1-10), and metadata like upvotes, creation date, subreddit, etc.',
                            },
                            {
                                question:
                                    'Can I customize keywords or industries?',
                                answer: "Yes! You can fully customize your product's attributes including title, description, MRR, industry, keywords, and more. Our AI learns from your preferences to improve lead quality over time.",
                            },
                            {
                                question:
                                    'What if Reddit changes their API or bans scraping?',
                                answer: "We use Reddit's official API and comply with all their terms of service. Our system is designed to respect rate limits and other restrictions to ensure long-term reliability. We also have backup systems in place.",
                            },
                            {
                                question: 'How fresh are the leads?',
                                answer: 'Our system scans Reddit in near real-time. Most leads are delivered within 15-30 seconds of being posted on Reddit, giving you the opportunity to be one of the first to respond and engage.',
                            },
                            {
                                question:
                                    'Can I get notifications for new leads?',
                                answer: 'Yes! You can receive email notifications, Slack alerts, or webhook notifications for new leads. You can customize notification frequency and set minimum quality scores for alerts.',
                            },
                        ].map((faq, index) => (
                            <Card key={index} className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-left text-lg">
                                        {faq.question}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        {faq.answer}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-[#576F72] to-[#344054] py-20 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Turn Reddit Into Your Lead Generation Machine?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Join hundreds of businesses already using DigReddit to
                        find their next customers. Start your free trial today -
                        no credit card required.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        <Button
                            size="lg"
                            className="bg-white text-[#576F72] hover:bg-gray-100 font-semibold"
                        >
                            Start Free Trial
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10"
                        >
                            Schedule Demo
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-8 text-sm opacity-80">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>14-day free trial</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>No setup fees</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Stay Updated
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join our newsletter for product updates, feature
                        announcements, and lead generation tips. We also send
                        surveys to prioritize new features based on your
                        feedback!
                    </p>

                    <div className="max-w-md mx-auto">
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1"
                            />
                            <Button className="bg-gradient-to-r from-[#576F72] to-[#344054] hover:from-[#4a5f62] hover:to-[#2d3648]">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-[#576F72] to-[#344054] rounded-lg flex items-center justify-center">
                                    <Search className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">
                                    DigReddit
                                </span>
                            </div>
                            <p className="mb-4">
                                Turn Reddit conversations into qualified leads
                                for your business in real-time.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-white font-medium mb-4">
                                Product
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="#how-it-works"
                                        className="hover:text-white transition-colors"
                                    >
                                        How It Works
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#who-its-for"
                                        className="hover:text-white transition-colors"
                                    >
                                        Who It's For
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#faq"
                                        className="hover:text-white transition-colors"
                                    >
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Pricing
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-medium mb-4">
                                Company
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Privacy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Terms
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-medium mb-4">
                                Contact
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="mailto:balamyohance@gmail.com"
                                        className="hover:text-white transition-colors"
                                    >
                                        balamyohance@gmail.com
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="https://www.reddit.com/user/Hot-Glass8919"
                                        className="hover:text-white transition-colors"
                                    >
                                        u/Hot-Glass8919
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p>© 2025 DigReddit. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <Link
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                </svg>
                            </Link>
                            <Link
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                    <rect width="4" height="12" x="2" y="9" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                            </Link>
                            <Link
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <rect
                                        width="20"
                                        height="20"
                                        x="2"
                                        y="2"
                                        rx="5"
                                        ry="5"
                                    />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line
                                        x1="17.5"
                                        x2="17.51"
                                        y1="6.5"
                                        y2="6.5"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

import LightButton from '@/lib/components/button/light';
import { Card, CardContent } from '@/lib/components/ui/card';
import { ArrowRight, Filter, MessageSquare, Search, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Header/Navigation */}
            <header className="container mx-auto py-6 px-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-purple-600" />
                    <span className="text-xl font-bold">DigReddit</span>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="#how-it-works"
                        className="text-sm font-medium hover:text-purple-600 transition-colors"
                    >
                        How It Works
                    </Link>
                    <Link
                        href="#pricing"
                        className="text-sm font-medium hover:text-purple-600 transition-colors"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="#faq"
                        className="text-sm font-medium hover:text-purple-600 transition-colors"
                    >
                        FAQ
                    </Link>
                    <Link
                        href="#contact"
                        className="text-sm font-medium hover:text-purple-600 transition-colors"
                    >
                        Contact
                    </Link>
                </nav>
                <LightButton title="Log in" className="hidden md:flex">
                    Log In
                </LightButton>
                <LightButton title="Menu" className="md:hidden">
                    <>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                        >
                            <line x1="4" x2="20" y1="12" y2="12" />
                            <line x1="4" x2="20" y1="6" y2="6" />
                            <line x1="4" x2="20" y1="18" y2="18" />
                        </svg>
                    </>
                </LightButton>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto py-16 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                            Turn Reddit Conversations Into Hot Leads — In Real
                            Time.
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            DigReddit scans every new post and comment on Reddit
                            to uncover valuable leads tailored to your business.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <LightButton
                                title="Get Started"
                                className="bg-purple-600 hover:bg-purple-700 min-w-lg"
                            >
                                <>
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            </LightButton>
                            <LightButton title="See It In Action" />
                        </div>
                    </div>
                    <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
                        <Image
                            src="/placeholder.svg?height=800&width=600"
                            alt="DigReddit in action"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-16">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-purple-100 p-4 rounded-full mb-6">
                                <Search className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Step 1
                            </h3>
                            <p className="text-gray-600">
                                We scan every Reddit post & comment in real-time
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-purple-100 p-4 rounded-full mb-6">
                                <Filter className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Step 2
                            </h3>
                            <p className="text-gray-600">
                                We match posts using keyword and semantic
                                similarity (via embeddings or GPT)
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-purple-100 p-4 rounded-full mb-6">
                                <MessageSquare className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Step 3
                            </h3>
                            <p className="text-gray-600">
                                We deliver relevant leads directly to your inbox
                                or webhook
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who It's For */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-16">
                        Who It&apos;s For
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {[
                            {
                                title: 'B2B SaaS startups',
                                description:
                                    'Find prospects asking about tools like yours',
                            },
                            {
                                title: 'Solo founders',
                                description:
                                    'Discover potential customers without a sales team',
                            },
                            {
                                title: 'Agencies',
                                description:
                                    'Identify businesses needing your services',
                            },
                            {
                                title: 'Recruiters',
                                description:
                                    'Spot talent discussing career moves',
                            },
                            {
                                title: 'Consultants',
                                description:
                                    'Connect with people seeking your expertise',
                            },
                        ].map((item, index) => (
                            <Card key={index} className="h-full">
                                <CardContent className="pt-6">
                                    <h3 className="text-lg font-semibold mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Real-Time Demo */}
            <section id="demo" className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-6">
                        Real-Time Demo
                    </h2>
                    <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                        See how DigReddit transforms Reddit conversations into
                        qualified leads for your business
                    </p>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
                        <div className="flex border-b">
                            <LightButton
                                className="py-4 px-6 font-medium text-purple-600 border-b-2 border-purple-600"
                                title="Before (Reddit Post)"
                            />
                            <LightButton
                                className="py-4 px-6 font-medium text-gray-500"
                                title="After (DigReddit Match)"
                            />
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                    <div>
                                        <p className="font-medium">
                                            u/startup_founder
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Posted 2 hours ago in r/SaaS
                                        </p>
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium mb-2">
                                    Looking for a tool to monitor social media
                                    for leads - any recommendations?
                                </h3>
                                <p className="text-gray-700">
                                    Hey everyone, I&apos;m running a small
                                    marketing agency and we&apos;re trying to
                                    find new clients. I&apos;ve heard people
                                    mention finding leads on Reddit and Twitter,
                                    but manually searching is too
                                    time-consuming. Are there any good tools
                                    that can automatically scan these platforms
                                    and alert me when someone&apos;s looking for
                                    services like ours?
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-16">
                        What Our Users Say
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: 'DigReddit helped us find 15 new clients in our first month. The leads are incredibly targeted.',
                                author: 'Sarah J.',
                                company: 'TechGrowth Agency',
                            },
                            {
                                quote: 'As a solo founder, this tool is like having a dedicated sales team working 24/7.',
                                author: 'Michael T.',
                                company: 'DevTools SaaS',
                            },
                            {
                                quote: 'The quality of leads is impressive. These are people actively looking for solutions like ours.',
                                author: 'Alex R.',
                                company: 'RecruitPro',
                            },
                        ].map((testimonial, index) => (
                            <Card key={index} className="h-full">
                                <CardContent className="pt-6">
                                    <p className="italic text-gray-700 mb-4">
                                        "{testimonial.quote}
                                    </p>
                                    <div>
                                        <p className="font-medium">
                                            {testimonial.author}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {testimonial.company}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="flex justify-center gap-8 mt-16">
                        <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                            LOGO
                        </div>
                        <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                            LOGO
                        </div>
                        <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                            LOGO
                        </div>
                        <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                            LOGO
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-6">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                        Choose the plan that works best for your business needs
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <Card className="border-2 border-gray-200">
                            <CardContent className="pt-6">
                                <h3 className="text-xl font-bold mb-2">
                                    Free Trial
                                </h3>
                                <div className="mb-4">
                                    <span className="text-3xl font-bold">
                                        $0
                                    </span>
                                </div>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-start gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 text-green-500 mt-0.5"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>50 leads total</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 text-green-500 mt-0.5"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>Basic keyword matching</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 text-green-500 mt-0.5"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>Email delivery</span>
                                    </li>
                                </ul>
                                <LightButton
                                    className="w-full"
                                    title="Start Free Trial"
                                />
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-purple-600 relative">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                Most Popular
                            </div>
                            <CardContent className="pt-6">
                                <h3 className="text-xl font-bold mb-2">
                                    Starter
                                </h3>
                                <div className="mb-4">
                                    <span className="text-3xl font-bold">
                                        $49
                                    </span>
                                    <span className="text-gray-500">
                                        /month
                                    </span>
                                </div>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-start gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 text-green-500 mt-0.5"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>200 leads/month</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 text-green-500 mt-0.5"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>Advanced keyword matching</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 text-green-500 mt-0.5"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>Email + dashboard access</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 text-green-500 mt-0.5"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>Basic analytics</span>
                                    </li>
                                </ul>
                                <LightButton
                                    className="w-full bg-purple-600 hover:bg-purple-700"
                                    title="Get Started"
                                />
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-gray-200">
                            <CardContent className="pt-6">
                                <h3 className="text-xl font-bold mb-2">Pro</h3>
                                <div className="mb-4">
                                    <span className="text-3xl font-bold">
                                        $99
                                    </span>
                                    <span className="text-gray-500">
                                        /month
                                    </span>
                                </div>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-start gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 text-green-500 mt-0.5"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>Unlimited leads</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 text-green-500 mt-0.5"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>
                                            AI-powered semantic matching
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 text-green-500 mt-0.5"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>Webhook integration</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 text-green-500 mt-0.5"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>
                                            Advanced analytics & reporting
                                        </span>
                                    </li>
                                </ul>
                                <LightButton
                                    className="w-full"
                                    title="Contact Sales"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-16">
                        Frequently Asked Questions
                    </h2>
                    <div className="max-w-3xl mx-auto space-y-8">
                        {[
                            {
                                question: 'How do you define a lead?',
                                answer: 'We define a lead as a Reddit post or comment that matches your specified keywords or semantic criteria, indicating the user may be interested in your product or service. Each lead includes the post content, user information (if public), and relevance score.',
                            },
                            {
                                question:
                                    'Can I customize keywords or industries?',
                                answer: "Yes! All plans allow you to customize your keywords. The Starter and Pro plans offer more advanced customization options, including industry-specific templates and semantic matching to catch leads even when they don't use your exact keywords.",
                            },
                            {
                                question: 'What if Reddit bans scraping?',
                                answer: "We use Reddit's official API and comply with all their terms of service. Our system is designed to be respectful of rate limits and other restrictions to ensure long-term reliability of the service.",
                            },
                            {
                                question: 'How fresh are the leads?',
                                answer: 'Our system scans Reddit in near real-time. Most leads are delivered within 15 minutes of being posted on Reddit, giving you the opportunity to be one of the first to respond.',
                            },
                            {
                                question: 'Can I get notifications?',
                                answer: 'Yes! You can receive email notifications for new leads, or set up webhook integrations (Pro plan) to connect with your existing tools like Slack, Discord, or your CRM system.',
                            },
                        ].map((item, index) => (
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

            {/* CTA */}
            <section className="bg-purple-600 py-20 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Ready to Find Your Next Customer?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Start turning Reddit conversations into qualified leads
                        for your business today.
                    </p>
                    <LightButton
                        className="bg-white text-purple-600 hover:bg-gray-100"
                        title="Get Started For Free"
                    />
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-gray-900 text-gray-400 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Zap className="h-6 w-6 text-purple-400" />
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
                                        href="#pricing"
                                        className="hover:text-white transition-colors"
                                    >
                                        Pricing
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
                                        Careers
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-medium mb-4">
                                Legal
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Terms
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
                                        Cookies
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
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                </svg>
                            </Link>
                            <Link
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
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
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
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

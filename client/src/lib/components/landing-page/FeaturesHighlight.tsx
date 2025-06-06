import { CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function FeaturesHighlight() {
    return (
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
                                        Understand the emotional context behind
                                        each mention
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
                            src="/lead_card.png"
                            alt="Lead Scoring Dashboard"
                            width={500}
                            height={400}
                            className="rounded-2xl shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

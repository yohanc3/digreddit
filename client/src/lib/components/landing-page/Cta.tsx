'use client';

import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export default function CTA() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { apiPost } = useFetch();

    const { mutate: addNonBetaUserEmail } = useMutation({
        mutationFn: async (email: string) => {
            const { status } = await apiPost('api/beta-users/create', {
                email,
            });
            return status;
        },
        onSuccess: () => {
            setIsSubmitted(true);
            toast({
                title: 'Email added to waitlist.',
                description:
                    'You will be notified when spots become available.',
            });
        },
        onError: () => {
            setIsLoading(false);
            toast({
                title: 'Error adding email to waitlist.',
                description: 'Please try again.',
            });
        },
    });

    return (
        <>
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
                            className="border-white text-[#576F72] hover:bg-white/10"
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
                        {isSubmitted ? (
                            <p className="text-green-600 font-medium">
                                You are on the waitlist!
                            </p>
                        ) : (
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Button
                                    className="bg-gradient-to-r from-[#576F72] to-[#344054] hover:from-[#4a5f62] hover:to-[#2d3648]"
                                    onClick={async () => {
                                        setIsLoading(true);
                                        await addNonBetaUserEmail(email);
                                    }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Adding...' : 'Subscribe'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

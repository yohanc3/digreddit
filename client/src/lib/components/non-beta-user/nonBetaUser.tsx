'use client';

import { useState } from 'react';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { FullLogo } from '@/lib/components/logo';
import Header from '@/lib/components/landing-page/Header';
import { Session } from 'next-auth';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export default function NonBetaUserPage() {
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

    if (isSubmitted) {
        return (
            <div className="bg-white flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                        <div className="text-green-600 text-lg font-semibold mb-2">
                            Thank you for your interest!
                        </div>
                        <p className="text-secondaryColor text-primarySize">
                            We've added you to our beta testing waitlist. You'll
                            be notified when spots become available.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white flex flex-col items-center justify-center px-4 pt-20">
            <div className="w-full max-w-md">
                <div className="bg-white border border-light rounded-lg p-8 shadow-sm">
                    <div className="text-center mb-6">
                        <h1 className="text-bigSize font-bold text-secondaryColor mb-2">
                            Join the Beta Waitlist
                        </h1>
                        <p className="text-primarySize text-tertiaryColor">
                            Get early access to DigReddit and be among the first
                            to discover high-quality leads from Reddit.
                        </p>
                    </div>
                    <div className="space-y-2 pb-4">
                        <label
                            htmlFor="email"
                            className="block text-primarySize font-medium text-secondaryColor mb-2"
                        >
                            Email Address
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full"
                            disabled={isLoading}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="dark"
                        className="w-full"
                        disabled={isLoading || !email}
                        onClick={async () => {
                            setIsLoading(true);
                            await addNonBetaUserEmail(email);
                        }}
                    >
                        {isLoading
                            ? 'Joining Waitlist...'
                            : 'Join Beta Waitlist'}
                    </Button>

                    <div className="mt-6 pt-6 border-t border-light">
                        <div className="text-center">
                            <p className="text-tertiarySize text-tertiaryColor mb-3">
                                What you'll get with beta access:
                            </p>
                            <ul className="text-tertiarySize text-tertiaryColor space-y-1">
                                <li>
                                    • AI-powered lead discovery and evaluation
                                    from Reddit
                                </li>
                                <li>• Real time lead discovery </li>
                                <li>• AI Agent based lead engagement</li>
                                <li>• Priority customer support</li>
                                <li>• Discounted pricing for early adopters</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

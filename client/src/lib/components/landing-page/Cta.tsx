'use client';

import { toast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '../ui/button';

export default function Cta() {
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
        <section className="bg-[#576F72] py-20 text-white ">
            <div className="px-4 text-center flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold mb-6">Newsletter</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                    We have a newsletter system where we ask you guys for
                    feedback, and launch surveys to know what features to
                    prioritize!
                </p>
                {isSubmitted ? (
                    <p>You are on the waitlist!</p>
                ) : (
                    <div className="w-[15rem] flex flex-col gap-2">
                        <Input
                            className="text-black bg-slate-100"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            variant={'secondary'}
                            onClick={async () => {
                                await addNonBetaUserEmail(email);
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Adding...' : 'Add to waitlist'}
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}

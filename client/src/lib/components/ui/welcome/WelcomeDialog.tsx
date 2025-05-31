'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/lib/components/ui/dialog';
import { Button } from '@/lib/components/ui/button';
import { Plus, Search, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WelcomeDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
            setIsOpen(true);
        }
    }, []);

    function handleClose() {
        localStorage.setItem('hasSeenWelcome', 'true');
        setIsOpen(false);
    }

    function handleGetStarted() {
        localStorage.setItem('hasSeenWelcome', 'true');
        setIsOpen(false);
        router.push('/create-product');
    }

    const steps = [
        {
            icon: Plus,
            title: 'Describe your product',
            subtitle: "Tell us what you're building",
        },
        {
            icon: Search,
            title: 'We find your people',
            subtitle: 'Our system scans Reddit for potential customers',
        },
        {
            icon: Sparkles,
            title: 'Connect & grow',
            subtitle: 'Engage with qualified leads',
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-md border-0 bg-gradient-to-br from-slate-50 to-gray-50 p-0 overflow-hidden">
                <div className="p-8 text-center">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#576F72] to-[#344054] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Search className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#344054] mb-2">
                            Welcome to DigReddit
                        </h1>
                        <p className="text-[#475467]">
                            Turn Reddit conversations into customers
                        </p>
                    </div>

                    {/* Animated Steps */}
                    <div className="mb-8 space-y-4">
                        {steps.map((stepItem, index) => {
                            const Icon = stepItem.icon;
                            const isActive = step >= index;
                            const isCompleted = step > index;

                            return (
                                <div
                                    key={index}
                                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                                        isActive
                                            ? 'bg-white shadow-sm scale-105'
                                            : 'bg-white/50 scale-95 opacity-60'
                                    }`}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                            isCompleted
                                                ? 'bg-[#576F72]'
                                                : isActive
                                                  ? 'bg-[#475467]'
                                                  : 'bg-gray-300'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <Sparkles className="w-5 h-5 text-white" />
                                        ) : (
                                            <Icon className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-[#344054] text-sm">
                                            {stepItem.title}
                                        </h3>
                                        <p className="text-xs text-[#475467]">
                                            {stepItem.subtitle}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={handleGetStarted}
                            className="w-full bg-gradient-to-r from-[#576F72] to-[#344054] hover:from-[#4a5f62] hover:to-[#2d3648] text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 group"
                        >
                            Start Finding Leads
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={handleClose}
                            className="w-full text-[#475467] hover:text-[#344054] py-2"
                        >
                            {"I'll explore first"}
                        </Button>
                    </div>

                    {/* Fun fact */}
                    <div className="mt-6 p-3 bg-[#576F72]/10 rounded-lg border border-[#576F72]/20">
                        <p className="text-xs text-[#344054]">
                            💡 Most users find their first lead within 15-30
                            minutes
                        </p>
                    </div>
                </div>

                {/* Auto-advance animation */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                    <div
                        className="h-full bg-gradient-to-r from-[#576F72] to-[#344054] transition-all duration-1000 ease-out"
                        style={{
                            width: `${((step + 1) / steps.length) * 100}%`,
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

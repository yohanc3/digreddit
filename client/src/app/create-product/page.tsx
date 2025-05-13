'use client';

import { Badge } from '@/lib/components/ui/badge';
import { Button } from '@/lib/components/ui/button';
import { UseFetch } from '@/lib/frontend/hooks/useFetch';
import { X } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface FormDataTarget extends EventTarget {
    description: { value: string };
    title: { value: string };
    industry: { value: string };
    mrr?: { value: Number };
    url?: { value: string };
}

interface FormDataError {
    description?: boolean;
    title?: boolean;
    industry?: boolean;
    keywords?: boolean;
    mrr?: boolean;
    url?: boolean;
}

function ErrorText() {
    return (
        <p className="text-tertiarySize text-red-400 p-0">
            Please fill out this field.
        </p>
    );
}

export default function Dashboard() {
    const [keywords, setKeywords] = useState<string[]>([]);
    const [error, setError] = useState<FormDataError>({});
    const { apiPost } = UseFetch();
    function handleEnterKeyPress(
        event: React.KeyboardEvent<HTMLInputElement>,
        newKeyword: string
    ) {
        if (event.key === 'Enter') {
            event.preventDefault();
            (event.target as HTMLInputElement).value = '';
            setKeywords((prev) => [...prev, newKeyword]);
        }
    }

    async function submitLeadSearchDetails(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.target as FormDataTarget;
        const description = form.description.value;
        const title = form.title.value;
        const industry = form.industry.value;
        const mrr = form.mrr?.value || undefined;
        const url = form.url?.value || undefined;

        const newErrors: FormDataError = {
            description: !description,
            title: !title,
            industry: !industry,
            keywords: keywords.length < 1,
        };

        setError(newErrors);

        const hasErrors = Object.values(newErrors).some(
            (error) => error === true
        );

        //Successful Submit Logic
        if (!hasErrors) {
            'use server';
            try {
                const result = await apiPost('api/products', {
                    description,
                    title,
                    industry,
                    keywords,
                    mrr,
                    url
                })

                return result;
            } catch (e) {
                console.error({"message": "asdfasdf", e});
                return [];
            }
        }
    }

    return (
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto gap-y-4 px-4 pt-12 pb-8">
            {/* Title */}
            <div className="flex flex-col mb-2">
                <h1 className="text-3xl md:text-4xl font-semibold text-center text-secondaryColor">
                    Launch a Lead Search
                </h1>
                <p className="text-sm text-primaryColor text-center mt-1">
                    Describe your target lead, and we'll dig through Reddit for
                    you.
                </p>
            </div>
            <form
                className="flex flex-col gap-y-3"
                onSubmit={submitLeadSearchDetails}
            >
                {/* Lead Description */}
                <div className="flex flex-col gap-y-1">
                    <textarea
                        name="description"
                        className="w-full h-40 p-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                        placeholder='Tell use about your product and describe target audience (e.g., "I am working on a platform for clay artists and my target audience are people who like clay art, sculpture, architecture, etc..").'
                    />
                    {error.description && <ErrorText />}
                </div>
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Product Name */}
                    <div className="flex flex-col gap-y-1">
                        <label className="text-secondaryColor text-sm font-medium">
                            Name:
                        </label>
                        <input
                            name="title"
                            className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                            placeholder="e.g., DigReddit, Twitter, or KeepSake"
                        />
                        {error.title && <ErrorText />}
                    </div>

                    {/* Industry */}
                    <div className="flex flex-col gap-y-1">
                        <label className="text-secondaryColor text-sm font-medium">
                            Industry:
                        </label>
                        <input
                            name="industry"
                            className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                            placeholder="e.g., Real Estate, Tech, or Politics"
                        />
                        {error.industry && <ErrorText />}
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* MRR */}
                    <div className="flex flex-col gap-y-1">
                        <label className="text-secondaryColor text-sm font-medium">
                            MRR (Optional):
                        </label>
                        <input
                            name="mrr"
                            className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                            placeholder="e.g., 6000, 10000"
                            type="number"
                        />
                    </div>
                    {/* URL */}
                    <div className="flex flex-col gap-y-1">
                        <label className="text-secondaryColor text-sm font-medium">
                            URL (Optional):
                        </label>
                        <input
                            name="url"
                            className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                            placeholder="e.g., twitter.com, google.com"
                            type="text"
                        />
                    </div>
                </div>


                {/* Keywords Input */}
                <div className="flex flex-col gap-y-1 mt-1">
                    <label className="text-secondaryColor text-sm font-medium">
                        Keywords:
                    </label>
                    <input
                        className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                        placeholder="e.g., Tax, Sports, or Law"
                        onKeyDown={(e) => {
                            handleEnterKeyPress(e, e.currentTarget.value);
                        }}
                    />
                    {error.keywords && <ErrorText />}
                    <p className="text-tertiaryColor text-xs mt-1">
                        Add up to 50 keywords. Press Enter to add each one.
                    </p>

                    {/* Keywords List */}
                    <div className="flex flex-wrap gap-1.5 w-full mt-2 overflow-y-auto p-1">
                        {keywords.map((item: string, index: number) => (
                            <Badge
                                key={index}
                                variant={'leadKeyword'}
                                className="text-xs py-0.5 px-2 flex items-center justify-center gap-x-2"
                            >
                                {item}{' '}
                                <X
                                    key={index}
                                    width={13}
                                    strokeWidth={3}
                                    className="cursor-pointer text-red-400"
                                    onClick={() =>
                                        setKeywords((prev) => {
                                            return prev.filter(
                                                (keyword) => item != keyword
                                            );
                                        })
                                    }
                                />
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end mt-2">
                    <Button
                        variant={'dark'}
                        type="submit"
                        className="w-40 h-9 text-sm"
                    >
                        Create New Product
                    </Button>
                </div>
            </form>
        </div>
    );
}

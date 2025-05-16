'use client';

import { toast } from '@/hooks/use-toast';
import { AIResponseError, MaximumLengthReachedError, MissingFieldError } from '@/lib/components/error/form';
import { Button } from '@/lib/components/ui/button';
import KeywordsList from '@/lib/components/ui/keyword/keywordList';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import { readableDateFormat } from '@/lib/frontend/utils/timeFormat';
import { FormEvent, useState } from 'react';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi';
import { RiSparkling2Line } from 'react-icons/ri';

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

export default function Dashboard() {
    const [keywordsInput, setKeywordsInput] = useState<Record<"title" | "description" | "industry", string>>({
        "title": "",
        "description": "",
        "industry": ""
    })
    const [keywords, setKeywords] = useState<string[]>([]);
    const [error, setError] = useState<FormDataError>({});
    const [keywordsLengthError, setKeywordsLengthError] = useState<boolean>(false);
    const [aiError, setAiError] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [isKeywordsSubmitting, setIsKeywordsSubmitting] = useState<boolean>(false)
    const { apiPost } = useFetch();

    function handleKeywordInputEnterKeyPress(
        event: React.KeyboardEvent<HTMLInputElement>,
        newKeyword: string
    ) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (keywords.length <= 50) {
                (event.target as HTMLInputElement).value = '';
                setKeywords((prev) => [...prev, newKeyword]);
                setKeywordsLengthError(false)
            }else{
                setKeywordsLengthError(true)
            }
        }
    }

    async function submitLeadSearchDetails(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setAiError(false);
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
            try {
                const result = await apiPost('api/products', {
                    description,
                    title,
                    industry,
                    keywords,
                    mrr,
                    url
                })

                const createdAt = readableDateFormat(result.createdProduct.createdAt)

                toast({
                    title: `Lead Search Started for ${title}`,
                    description: "Started at: " + createdAt,
                    action: (
                        <BiCheckCircle color='#576F72' size={35} />
                    ),
                })
                setIsSubmitting(false)
                return result;
            } catch (e) {
                toast({
                    title: "Something Went Wrong",
                    description: "Try again later.",
                    action: (
                        <BiErrorCircle color='#f87171' size={35} />
                    ),
                })
                setIsSubmitting(false)
                return [];
            }
        }
        setIsSubmitting(false)
    }


    async function generateKeywords(event: any) {
        event.preventDefault();
        setIsSubmitting(true);
        setIsKeywordsSubmitting(true);
        setAiError(false);
        setKeywords([]);
        const description = keywordsInput.description;
        const title = keywordsInput.title;
        const industry = keywordsInput.industry;

        const newErrors: FormDataError = {
            description: !description,
            title: !title,
            industry: !industry
        };

        setError(newErrors);

        const hasErrors = Object.values(newErrors).some(
            (error) => error === true
        );

        //Successful Submit Logic
        if (!hasErrors) {
            try {
                const result = await apiPost('api/products/keywords', {
                    description,
                    title,
                    industry,
                })
                setKeywords(result)
            } catch (e) {
                console.error({ "message": "", e });
                setAiError(true);
            }
        }

        setIsSubmitting(false);
        setIsKeywordsSubmitting(false);

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
                        value={keywordsInput.description}
                        className="w-full h-40 p-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                        placeholder='Tell use about your product and describe target audience (e.g., "I am working on a platform for clay artists and my target audience are people who like clay art, sculpture, architecture, etc..").'
                        disabled={isSubmitting}
                        onChange={(e) => setKeywordsInput((prev) => { return { ...prev, "description": e.target.value } })}
                    />
                    {error.description && <MissingFieldError />}
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
                            value={keywordsInput.title}
                            className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                            placeholder="e.g., DigReddit, Twitter, or KeepSake"
                            disabled={isSubmitting}
                            onChange={(e) => setKeywordsInput((prev) => { return { ...prev, "title": e.target.value } })}
                        />
                        {error.title && <MissingFieldError />}
                    </div>

                    {/* Industry */}
                    <div className="flex flex-col gap-y-1">
                        <label className="text-secondaryColor text-sm font-medium">
                            Industry:
                        </label>
                        <input
                            name="industry"
                            value={keywordsInput.industry}
                            className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                            placeholder="e.g., Real Estate, Tech, or Politics"
                            disabled={isSubmitting}
                            onChange={(e) => setKeywordsInput((prev) => { return { ...prev, "industry": e.target.value } })}
                        />
                        {error.industry && <MissingFieldError />}
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
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                {/* Keywords Input */}
                <div className="flex flex-col gap-y-1 mt-1">
                    <div className='flex items-center gap-x-3'>
                        <label className="text-secondaryColor text-sm font-medium">
                            Keywords:
                        </label>
                        <Button
                            variant={'light'}
                            disabled={isSubmitting}
                            onClick={generateKeywords}
                        >
                            Generate Keywords <RiSparkling2Line />
                        </Button>
                        {aiError && <AIResponseError />}
                    </div>
                    {
                        keywords.length > 0 && <>
                            <input
                                className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                                placeholder="e.g., Tax, Sports, or Law"
                                onKeyDown={(e) => {
                                    handleKeywordInputEnterKeyPress(e, e.currentTarget.value);
                                }}
                                disabled={isSubmitting}
                            />
                            <p className="text-tertiaryColor text-xs mt-1">
                                Add up to 50 keywords. Press Enter to add each one.
                            </p>
                            {keywordsLengthError && <MaximumLengthReachedError />}
                        </>
                    }
                    <KeywordsList keywords={keywords} isLoading={isKeywordsSubmitting} setKeywords={setKeywords} />
                    {error.keywords && <MissingFieldError />}
                </div>

                {/* Submit Product Button */}
                <div className="flex justify-end mt-2">
                    <Button
                        variant={'dark'}
                        type="submit"
                        className="w-40 h-9 text-sm"
                        disabled={isSubmitting}
                    >
                        Create New Product
                    </Button>
                </div>
            </form >
        </div >
    );
}
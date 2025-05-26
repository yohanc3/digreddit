'use client';

// Constants
import { productDescriptionMaximumWords, productIndustryMaximumCharacters, productKeywordMaximumLength, productKeywordsMaximumLength, productMRRMaximumCharacters, productNameMaximumCharacters } from '@/lib/frontend/constant/form';

// Error Components
import { AIResponseError, MaximumCharactersReachedError, MaximumLengthReachedError, MaximumWordsReachedError, MissingFieldError } from '@/lib/components/error/form';

// Form Utils
import { isMaximumWordsReached, countWords, isMaximumCharactersReached, handleMRRInputOnChange, handleURLInputOnChange, handleIndustryInputOnChange, handleTitleInputOnChange, handleDescriptionInputOnChange, handleKeywordInputOnChange } from '@/lib/frontend/utils/productCreationForm';

// Product Form Types
import { ProductFormDataError, ProductFormDataFields, ProductFormDataTarget, ProductFormInputFields, ProductInputSubmitting, BetaLimitsDialogProps } from '@/types/frontend/product/form';

// Others
import { Button } from '@/lib/components/ui/button';
import { toast } from '@/hooks/use-toast';
import KeywordsList from '@/lib/components/ui/keyword/keywordList';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import { readableDateFormat } from '@/lib/frontend/utils/timeFormat';
import { FormEvent, useState } from 'react';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi';
import { RiSparkling2Line } from 'react-icons/ri';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/lib/components/ui/dialog';



export default function Dashboard() {
    const [formsInput, setFormsInput] = useState<ProductFormDataFields>({
        "title": "",
        "description": "",
        "industry": "",
        "mrr": "",
        "url": "",
        "keyword": "",
        "keywords": []
    })
    const [isSubmitting, setIsSubmitting] = useState<ProductInputSubmitting>({
        "form": false,
        "keywords": false
    })
    const [error, setError] = useState<ProductFormDataError>({
        description: false,
        title: false,
        industry: false,
        keywords: false,
        keywordslength: false,
        mrr: false,
        url: false,
        ai: false,
    });
    const [openBetaLimitsDialog, setOpenBetaLimitsDialog] = useState(false)
    const { apiPost } = useFetch();


    function setProductFormError(field: ProductFormDataError) {
        setError((prev) => { return { ...prev, ...field } })
    }

    function setProductInput(field: ProductFormInputFields) {
        setFormsInput((prev) => { return { ...prev, ...field } })
    }

    function handleKeywordInputEnterKeyPress(
        event: React.KeyboardEvent<HTMLInputElement>,
        newKeyword: string
    ) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (formsInput.keywords.length < productKeywordsMaximumLength) {
                (event.target as HTMLInputElement).value = '';
                setProductInput({ keywords: [...formsInput.keywords, newKeyword] });
                setProductFormError({ keywordslength: false, keywords: false })
            } else {
                setProductFormError({ keywordslength: true })
            }
        }
    }

    async function submitLeadSearchDetails(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting({ form: true });
        setProductFormError({ ai: false });
        const form = event.target as ProductFormDataTarget;
        const description = form.description.value;
        const title = form.title.value;
        const industry = form.industry.value;
        const mrr = form.mrr?.value || undefined;
        const url = form.url?.value || undefined;
        const keywords = formsInput.keywords || undefined;
        const newErrors: ProductFormDataError = {
            description: !description,
            title: !title,
            industry: !industry,
            keywords: formsInput.keywords.length < 1,
        };

        setProductFormError(newErrors);

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
                setIsSubmitting({ form: false });
                return result;
            } catch (e) {
                if ((e as Error).message === "Beta Limit") {
                    setOpenBetaLimitsDialog(true)
                } else {
                    toast({
                        title: "Something Went Wrong",
                        description: "Try again later.",
                        action: (
                            <BiErrorCircle color='#f87171' size={35} />
                        ),
                    })
                }
                setIsSubmitting({ form: false });
                return [];
            }
        }
        toast({
            title: "Missing Fields",
            description: "Please fill in all required fields before submitting.",
            action: (
                <BiErrorCircle color='#f87171' size={35} />
            ),
        })
        setIsSubmitting({ form: false });
    }

    async function generateKeywords(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        setIsSubmitting({ form: true, keywords: true });
        setProductFormError({ ai: false, keywords: false })
        setProductInput({ keywords: [] });
        const description = formsInput.description;
        const title = formsInput.title;
        const industry = formsInput.industry;

        const newErrors: ProductFormDataError = {
            description: !description,
            title: !title,
            industry: !industry
        };

        setProductFormError(newErrors);

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
                setProductInput({ keywords: result })
                setProductFormError({ keywords: false })
            } catch (e) {
                console.error({ message: e });
                setProductFormError({ ai: true })
            }
        }

        setIsSubmitting({ form: false, keywords: false });
    }

    return (
        <>
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

                <form className="flex flex-col gap-y-3" onSubmit={submitLeadSearchDetails}>

                    {/* Lead Description */}
                    <div className="flex flex-col gap-y-1">
                        <div className='text-tertiarySize w-full flex justify-end'>
                            {countWords(formsInput.description)}/{productDescriptionMaximumWords} words
                        </div>
                        <textarea
                            name="description"
                            value={formsInput.description}
                            className="w-full h-40 p-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                            placeholder='Tell use about your product and describe target audience (e.g., "I am working on a platform for clay artists and my target audience are people who like clay art, sculpture, architecture, etc..").'
                            disabled={isSubmitting.form || isSubmitting.keywords}
                            onChange={(e) => handleDescriptionInputOnChange(e, setFormsInput, setProductFormError)}
                        />

                        {/* Description Error */}
                        <MaximumWordsReachedError trigger={isMaximumWordsReached(formsInput.description, productDescriptionMaximumWords)} />
                        <MissingFieldError trigger={Boolean(error.description)} />
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
                                value={formsInput.title}
                                className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                                placeholder="e.g., DigReddit, Twitter, or KeepSake"
                                disabled={isSubmitting.form || isSubmitting.keywords}
                                onChange={(e) => handleTitleInputOnChange(e, setFormsInput, setProductFormError)}
                            />

                            {/* Title Error */}
                            <MaximumCharactersReachedError trigger={isMaximumCharactersReached(formsInput.title, productNameMaximumCharacters)} />
                            <MissingFieldError trigger={Boolean(error.title)} />
                        </div>

                        {/* Industry */}
                        <div className="flex flex-col gap-y-1">
                            <label className="text-secondaryColor text-sm font-medium">
                                Industry:
                            </label>
                            <input
                                name="industry"
                                value={formsInput.industry}
                                className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                                placeholder="e.g., Real Estate, Tech, or Politics"
                                disabled={isSubmitting.form || isSubmitting.keywords}
                                onChange={(e) => handleIndustryInputOnChange(e, setFormsInput, setProductFormError)}
                            />

                            {/* Industry Error */}
                            <MaximumCharactersReachedError trigger={isMaximumCharactersReached(formsInput.industry, productIndustryMaximumCharacters)} />
                            <MissingFieldError trigger={Boolean(error.industry)} />
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
                                value={formsInput.mrr}
                                className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                                placeholder="e.g., 6000, 10000"
                                type="text"
                                onChange={(e) => { handleMRRInputOnChange(e, setFormsInput, setProductFormError) }}
                                disabled={isSubmitting.form || isSubmitting.keywords}
                            />

                            {/* MRR Error */}
                            <MaximumCharactersReachedError trigger={isMaximumCharactersReached(formsInput.mrr?.toString() || "", productMRRMaximumCharacters)} />
                        </div>


                        {/* URL */}
                        <div className="flex flex-col gap-y-1">
                            <label className="text-secondaryColor text-sm font-medium">
                                URL (Optional):
                            </label>
                            <input
                                name="url"
                                value={formsInput.url}
                                className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                                placeholder="e.g., twitter.com, google.com"
                                type="url"
                                onChange={(e) => { handleURLInputOnChange(e, setFormsInput, setProductFormError) }}
                                disabled={isSubmitting.form || isSubmitting.keywords}
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
                                disabled={isSubmitting.form || isSubmitting.keywords}
                                onClick={generateKeywords}
                            >
                                Generate Keywords <RiSparkling2Line />
                            </Button>

                            {/* Fetch Generated Keywords Error*/}
                            <AIResponseError trigger={Boolean(error.ai)} />
                        </div>

                        {
                            formsInput.keywords.length > 0 && <>
                                <input
                                    value={formsInput.keyword}
                                    className="py-2 px-3 text-sm rounded-md border-light border focus:ring-1 focus:ring-secondaryColor focus:outline-none transition-shadow"
                                    placeholder="e.g., Tax, Sports, or Law"
                                    onChange={(e) => { handleKeywordInputOnChange(e, setFormsInput, setProductFormError) }}
                                    onKeyDown={(e) => { handleKeywordInputEnterKeyPress(e, e.currentTarget.value) }}
                                    disabled={isSubmitting.form || isSubmitting.keywords}
                                />
                                <p className="text-tertiaryColor text-xs mt-1">
                                    Add up to {productKeywordsMaximumLength} keywords. Press Enter to add each one.
                                </p>
                                <MaximumCharactersReachedError trigger={isMaximumCharactersReached(formsInput.keyword, productKeywordMaximumLength)} />
                                <MaximumLengthReachedError trigger={Boolean(error.keywordslength)} />
                            </>
                        }

                        {/* Generated Keywords & Input List */}
                        <KeywordsList keywords={formsInput.keywords} isLoading={Boolean(isSubmitting.keywords)} setValue={setFormsInput} />

                        {/* Keywords Error */}
                        <MissingFieldError trigger={Boolean(error.keywords)} />
                    </div>

                    {/* Submit Product Button */}
                    <div className="flex justify-end mt-2">
                        <Button
                            variant={'dark'}
                            type="submit"
                            className="w-40 h-9 text-sm"
                            disabled={isSubmitting.form || isSubmitting.keywords}
                        >
                            Create New Product
                        </Button>
                    </div>
                </form >
            </div >
            <BetaLimitsDialog isOpen={openBetaLimitsDialog} setIsOpen={setOpenBetaLimitsDialog} />
        </>
    );
}

export function BetaLimitsDialog({ isOpen, setIsOpen }: BetaLimitsDialogProps) {
    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle>Beta Limits Reached!</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    You’ve reached the limit of 2 products allowed during our beta. We’re currently testing things out and will expand limits soon — stay tuned!
                </div>
                <DialogFooter>
                    <DialogClose onClick={() => setIsOpen(false)}>Close</DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
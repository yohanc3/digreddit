export interface ProductFormDataFields {
    description: string;
    title: string;
    industry: string;
    keyword: string;
    keywords: string[];
    mrr?: string;
    url?: string;
}

export interface ProductFormInputFields {
    description?: string;
    title?: string;
    industry?: string;
    keyword?: string;
    keywords?: string[];
    mrr?: string;
    url?: string;
}

export interface ProductFormDataTarget extends EventTarget {
    description: { value: string };
    title: { value: string };
    industry: { value: string };
    mrr?: { value: number };
    url?: { value: string };
}

export interface ProductFormDataError {
    description?: boolean;
    title?: boolean;
    industry?: boolean;
    keyword?: boolean;
    keywords?: boolean;
    keywordslength?: boolean;
    mrr?: boolean;
    url?: boolean;
    ai?: boolean;
}

export interface ProductInputSubmitting {
    form?: boolean;
    keywords?: boolean;
}

export interface BetaLimitsDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

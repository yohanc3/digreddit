import { ChangeEvent } from "react";

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
    keyword?:string;
    keywords?: string[];
    mrr?: string;
    url?: string;
}

export interface ProductFormDataTarget extends EventTarget {
    description: { value: string };
    title: { value: string };
    industry: { value: string };
    mrr?: { value: Number };
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
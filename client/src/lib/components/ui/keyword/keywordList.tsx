import { X } from "lucide-react";
import { Badge } from "../badge";
import KeywordsListLoading from "./keywordsListLoading";
import clsx from "clsx";
import { ProductFormDataFields, ProductFormInputFields } from "@/types/frontend/product/form";
import { SetStateAction } from "react";

type KeywordsListProps = {
    keywords: string[];
    isLoading: boolean;
    setValue: React.Dispatch<SetStateAction<ProductFormDataFields>>;
};

export default function KeywordsList({ keywords, isLoading = false, setValue }: KeywordsListProps) {
    return (
        <div className={clsx("flex flex-wrap gap-1.5 w-full mt-2 overflow-y-auto")}>
            {
                !isLoading
                    ? keywords.map((item: string, index: number) => (
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
                                    setValue((prev) => ({...prev, "keywords": prev.keywords.filter((keyword)=> item != keyword)}))
                                }
                            />
                        </Badge>
                    ))
                    : <KeywordsListLoading />
            }
        </div>
    )
}
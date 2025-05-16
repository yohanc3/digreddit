import { X } from "lucide-react";
import { Badge } from "../badge";
import { Skeleton } from "../skeleton"
import KeywordsListLoading from "./keywordsListLoading";
import clsx from "clsx";

type KeywordsListProps = {
    keywords: string[];
    isLoading: boolean;
    setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function KeywordsList({ keywords, isLoading = false, setKeywords }: KeywordsListProps) {
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
                                    setKeywords((prev) => {
                                        return prev.filter(
                                            (keyword) => item != keyword
                                        );
                                    })
                                }
                            />
                        </Badge>
                    ))
                    : <KeywordsListLoading />
            }
        </div>
    )
}
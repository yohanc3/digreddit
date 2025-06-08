import { Bookmark } from '@/types/backend/db';
import clsx from 'clsx';
import BookmarkPageCard from './bookmarkPageCard';

interface BookmarkListProps {
    className?: string,
    bookmarkList: {
        productId: string;
        productTitle: string;
        bookmarks: {
            id: string;
            title: string;
            description: string;
            createdAt: string;
            updatedAt: string;
        }[]
    }
}

export default function BookmarkList({
    className,
    bookmarkList
}: BookmarkListProps) {
    return (
        <div
            className={clsx(
                className,
                'w-full flex flex-col text-black px-3 py-2 rounded-lg transition-all duration-200 ease-in-out'
            )}
        >
            <div>
                <div className='font-semibold text-lg !text-primaryColor'>
                    {bookmarkList.productTitle} Bookmarks
                </div>
            </div>
            <div className='grid grid-cols-3 gap-2'>
                {
                    bookmarkList.bookmarks.map((bookmark) => {
                        return <BookmarkPageCard key={bookmark.id} productID={bookmarkList.productId} bookmark={bookmark} />
                    })
                }
            </div>  
        </div>
    );
}

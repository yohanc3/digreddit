'use client';

import BookmarkList from '@/lib/components/ui/bookmark/bookmarkList';
import { Button } from '@/lib/components/ui/button';
import { useUserBookmarks } from '@/lib/frontend/hooks/useUserBookmarks';
import { BiBookBookmark, BiBookmark, BiBookmarks, BiFolder } from 'react-icons/bi';

export default function Dashboard() {
    const { bookmarks: productList, isBookmarksLoading } = useUserBookmarks()
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className='flex flex-row space-x-1 items-center text-primaryColor mb-6'>
                <BiBookmarks className='font-semibold' size={36} />
                <div className="text-xl md:text-3xl font-semibold">
                    Your Bookmarks
                </div>
            </div>
            <div className="w-full flex flex-col gap-y-6">
                {
                    !isBookmarksLoading && productList && productList?.length > 0 &&
                    productList.map((product, index) => {
                        return <BookmarkList key={index} bookmarkList={product} />
                    })
                }
            </div>
        </div>
    );
}

import { db } from '@/db';
import { users } from '@/db/schema';
import RedditLeadCard from '@/lib/components/ui/lead/card';

export default async function Dashboard() {
    // const usersData = await db.select().from(users);

    // const firstUser = usersData.at(0);

    // console.log('first user: ', firstUser);

    return (
        <div className="w-2/3">
            <div className="w-full p-4 justify-center grid grid-cols-3 gap-2">
                <RedditLeadCard />
                <RedditLeadCard />
                <RedditLeadCard />
                <RedditLeadCard />
                <RedditLeadCard />
                <RedditLeadCard />
                <RedditLeadCard />
                <RedditLeadCard />
                <RedditLeadCard />
                <RedditLeadCard />
            </div>
        </div>
    );
}

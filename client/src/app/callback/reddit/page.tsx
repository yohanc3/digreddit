import { redirect } from 'next/navigation';
import { productsQueries } from '@/db';
import DashboardHandler from '@/lib/components/dashboard/DashboardHandler';
import { auth } from '../../../../auth';
import { useFetch } from '@/lib/frontend/hooks/useFetch';
import { RedditConnectionPage } from '@/lib/components/reddit/connection';

export default async function Dashboard() {
    const session = await auth();

    if (!session || !session.user || !session.user.id) redirect('/');

    return <RedditConnectionPage />;
}

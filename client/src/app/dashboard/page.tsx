import { auth } from '../../../auth';
import { redirect } from 'next/navigation';
import { productsQueries } from '@/db';
import DashboardHandler from '@/lib/components/dashboard/DashboardHandler';
import WelcomeDialog from '@/lib/components/ui/welcome/WelcomeDialog';

export default async function Dashboard() {
    const session = await auth();

    if (!session || !session.user || !session.user.id) redirect('/');

    const fetchedProducts = await productsQueries.getAllProductsByUserID(
        session.user.id
    );

    return (
        <>
            <DashboardHandler fetchedProducts={fetchedProducts} />
            <WelcomeDialog />
        </>
    );
}

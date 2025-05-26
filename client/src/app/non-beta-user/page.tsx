import { auth } from '../../../auth';
import NonBetaUserPage from '@/lib/components/non-beta-user/nonBetaUser';
import Header from '@/lib/components/landing-page/Header';

export default async function NonBetaUser() {
    const session = await auth();
    return (
        <>
            <Header session={session} showNav={false} />
            <NonBetaUserPage />
        </>
    );
}

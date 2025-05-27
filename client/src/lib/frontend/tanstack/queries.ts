import { queryClient } from '@/app/providers';
import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { useFetch } from '../hooks/useFetch';

export function useUpdateLeadInteraction() {
    const { apiPost } = useFetch();

    const { mutate: updateLeadInteraction } = useMutation({
        mutationFn: async ({
            leadID,
            isPost,
        }: {
            leadID: string;
            isPost: boolean;
        }) => {
            await apiPost('api/leads/update-interaction', {
                leadID,
                isInteracted: true,
                isPost,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allLeads'] });
            toast({
                title: 'Lead interaction updated.',
                description: 'The lead interaction has been updated.',
            });
        },
        onError: (error) => {
            console.error('Error when updating lead interaction: ', error);
            toast({
                title: 'Error when updating lead interaction.',
                description: 'The lead interaction has not been updated.',
            });
        },
    });

    return updateLeadInteraction;
}

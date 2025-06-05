import { queryClient } from '@/app/providers';
import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { useFetch } from '../hooks/useFetch';
import { useQueryClient } from '@tanstack/react-query';

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

export function useUpdateLeadStage() {
    const { apiPut } = useFetch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            leadID,
            stage,
            isPost,
        }: {
            leadID: string;
            stage: 'identification' | 'initial_outreach' | 'engagement' | 'skipped';
            isPost: boolean;
        }) => {
            return await apiPut('api/leads/stage', {
                leadID,
                stage,
                isPost,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allLeads'] });
        },
    });
}

export function useGenerateAIResponse() {
    const { apiPost } = useFetch();

    return useMutation({
        mutationFn: async ({
            leadMessage,
            productID,
        }: {
            leadMessage: string;
            productID: string;
        }) => {
            const response = await apiPost('api/leads/generate-response', {
                leadMessage,
                productID,
            });
            return response.generatedResponse;
        },
        onError: (error) => {
            console.error('Error generating AI response:', error);
            toast({
                title: 'Error',
                description: 'Failed to generate AI response',
                variant: 'destructive',
            });
        },
    });
}

export function usePostComment() {
    const { apiPost } = useFetch();

    return useMutation({
        mutationFn: async ({
            accessToken,
            thingID,
            comment,
            isPost,
        }: {
            accessToken: string;
            thingID: string;
            comment: string;
            isPost: boolean;
        }) => {
            const response = await apiPost('api/reddit/comment', {
                accessToken,
                isPost,
                thingID,
                comment,
            });

            if (response.accessToken) {
                localStorage.setItem(
                    'reddit_access_token',
                    response.accessToken
                );
            }

            return response.comment;
        },
    });
}

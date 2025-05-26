import { NextResponse } from 'next/server';

export function useFetch() {
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    async function apiGet(route: string, headers?: Record<string, string>) {
        try {
            const result = await fetch(`${APP_URL}/${route}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            });

            if (!result.ok) {
                throw new Error(
                    `GET ${route} failed with status ${result.status}`
                );
            }

            return await result.json();
        } catch (error) {
            console.error('GET request failed:', error);
            throw error;
        }
    }

    async function apiPost(
        route: string,
        body: Record<string, unknown>,
        headers?: Record<string, string>
    ) {
        try {
            const result = await fetch(`${APP_URL}/${route}`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            });

            if (!result.ok) {
                const res = await result.json()
                throw new Error(
                    res?.error || `POST ${route} failed with status ${result.status}`
                );
            }

            return await result.json();
        } catch (error) {
            console.error('POST request failed:', error);
            throw error;
        }
    }

    return {
        apiGet,
        apiPost,
    };
}

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // Get the origin from the request
        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;

        // Call the cron endpoint with proper authorization
        const response = await fetch(`${baseUrl}/api/cron/send-newsletter`, {
            headers: {
                'Authorization': `Bearer ${process.env.CRON_SECRET}`
            }
        });

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error triggering newsletter:', error);
        return NextResponse.json(
            { error: 'Failed to trigger newsletter' },
            { status: 500 }
        );
    }
}

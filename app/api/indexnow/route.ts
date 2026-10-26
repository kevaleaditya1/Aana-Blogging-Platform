import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { submitToIndexNow } from '@/lib/indexnow';

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const body = await request.json();
        const urls = Array.isArray(body.urls) ? body.urls.filter((url: unknown): url is string => typeof url === 'string') : [];
        return NextResponse.json({ success: true, ...(await submitToIndexNow(urls)) });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'IndexNow submission failed' }, { status: 500 });
    }
}

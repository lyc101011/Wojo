import { NextResponse } from 'next/server';
import { getProblems } from '@/lib/problems-loader';

export async function GET() {
    const problems = getProblems();
    return NextResponse.json(problems);
}

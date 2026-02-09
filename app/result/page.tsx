'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card";

function ResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const score = parseFloat(searchParams.get('score') || '0');
    // const total = searchParams.get('total') || '0';
    const percentage = Math.round(score * 100);

    return (
        <Card className="max-w-md w-full text-center">
            <CardHeader>
                <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
                <CardDescription>Thank you for your submission.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-6xl font-bold text-primary">
                    {percentage}%
                </div>
                <p className="text-muted-foreground">
                    Accuracy Rate
                </p>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={() => router.push('/')}>
                    Back to Home
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function ResultPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
            <Suspense fallback={<div>Loading result...</div>}>
                <ResultContent />
            </Suspense>
        </main>
    );
}

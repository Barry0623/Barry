'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question } from '@/types';
import { submitQuizResult } from '@/app/actions';

interface QuizClientProps {
    examId: string;
    questions: Question[];
}

export function QuizClient({ examId, questions }: QuizClientProps) {
    const router = useRouter();
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [studentName, setStudentName] = useState<string | null>(null);
    const [studentNumber, setStudentNumber] = useState<string | null>(null);

    useEffect(() => {
        const name = sessionStorage.getItem('studentName');
        const number = sessionStorage.getItem('studentNumber');

        if (!name || !number) {
            toast.error('Student details not found. Please login again.');
            router.push('/');
        } else {
            setStudentName(name);
            setStudentNumber(number);
        }
    }, [router]);

    const handleOptionSelect = (questionId: string, value: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!studentName || !studentNumber) return;

        // Check if all questions are answered
        if (Object.keys(answers).length !== questions.length) {
            toast.warning('Please answer all questions before submitting.');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await submitQuizResult({
                examId,
                studentName,
                studentNumber,
                answers,
            });

            if (result.success) {
                toast.success('Quiz submitted successfully!');
                // Clear session storage? Maybe keep to show result?
                // Let's pass the result to the result page via query params or similar
                // Or fetch result from server?
                // Minimal approach: Redirect to result page with score
                router.push(`/result?score=${result.accuracyRate}&total=${questions.length}`);
            } else {
                toast.error('Failed to submit quiz. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred during submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!studentName) return null; // Or loading spinner

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-secondary p-4 rounded-lg">
                <div>
                    <p className="font-medium">Student: {studentName}</p>
                    <p className="text-sm text-muted-foreground">ID: {studentNumber}</p>
                </div>
                <div className="text-right">
                    <p className="font-medium">Questions: {questions.length}</p>
                    <p className="text-sm text-muted-foreground">Answered: {Object.keys(answers).length}</p>
                </div>
            </div>

            {questions.map((q, index) => (
                <Card key={q.id}>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {index + 1}. {q.question}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            onValueChange={(value) => handleOptionSelect(q.id, value)}
                            value={answers[q.id]}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="option_a" id={`q${q.id}-a`} />
                                <Label htmlFor={`q${q.id}-a`}>{q.options.a}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="option_b" id={`q${q.id}-b`} />
                                <Label htmlFor={`q${q.id}-b`}>{q.options.b}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="option_c" id={`q${q.id}-c`} />
                                <Label htmlFor={`q${q.id}-c`}>{q.options.c}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="option_d" id={`q${q.id}-d`} />
                                <Label htmlFor={`q${q.id}-d`}>{q.options.d}</Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>
            ))}

            <Button
                className="w-full text-lg py-6"
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
        </div>
    );
}

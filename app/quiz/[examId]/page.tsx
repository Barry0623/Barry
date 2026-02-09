import { getActiveExams, getQuestions } from "@/lib/notion";
import { QuizClient } from "@/components/quiz-client";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface QuizPageProps {
    params: {
        examId: string;
    };
}

// Generate static params if we wanted static site generation, but for Notion we likely want dynamic.
// But we can verify if exam is active?
// For now, simpler to just fetch.

export default async function QuizPage({ params }: QuizPageProps) {
    // Verify exam exists and is active?
    // getActiveExams() returns all active.
    const exams = await getActiveExams();
    const exam = exams.find((e) => e.id === params.examId);

    if (!exam) {
        return notFound();
    }

    const questions = await getQuestions(params.examId);

    return (
        <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-gray-50">
            <div className="z-10 max-w-3xl w-full">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold">{exam.title}</h1>
                    <p className="text-muted-foreground">Please answer all questions.</p>
                </div>

                <QuizClient examId={params.examId} questions={questions} />
            </div>
        </main>
    );
}

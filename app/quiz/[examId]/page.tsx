import { getActiveExams, getQuestions } from "@/lib/notion";
import { QuizClient } from "@/components/quiz-client";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface QuizPageProps {
    params: Promise<{
        examId: string;
    }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
    const { examId } = await params;

    // Fetch all exams (we removed the Active filter)
    const exams = await getActiveExams();
    const exam = exams.find((e) => e.id === examId);

    if (!exam) {
        return notFound();
    }

    const questions = await getQuestions(examId);

    return (
        <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center p-4 md:p-12">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-3xl w-full">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white">{exam.title}</h1>
                    <p className="text-zinc-400 mt-2">請回答所有問題</p>
                </div>

                <QuizClient examId={examId} questions={questions} />
            </div>
        </main>
    );
}

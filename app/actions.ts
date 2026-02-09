'use server';

import { getActiveExams, submitStudentResult, getQuestions } from "@/lib/notion";
import { StudentResult } from "@/types";

export async function verifyExamPassword(examId: string, password: string) {
    const exams = await getActiveExams();
    const exam = exams.find((e) => e.id === examId);

    if (!exam) return { success: false, message: 'Exam not found' };

    if (exam.password === password) {
        return { success: true };
    } else {
        return { success: false, message: 'Incorrect password' };
    }
}

export async function submitQuizResult(data: Omit<StudentResult, 'accuracyRate'>) {
    // In a real app, don't trust client score.
    // Fetch questions to get correct answers and calculate score server-side.
    const questions = await getQuestions(data.examId);

    let correctCount = 0;
    questions.forEach(q => {
        // Simple string comparison. 
        // Ensure the values "option_a", "option_b", etc. match what's in Notion.
        if (data.answers[q.id] === q.answer) {
            correctCount++;
        }
    });

    const accuracyRate = questions.length > 0 ? correctCount / questions.length : 0;

    try {
        await submitStudentResult({
            ...data,
            accuracyRate: accuracyRate,
        });
        return { success: true, accuracyRate };
    } catch (error) {
        console.error("Error submitting result:", error);
        return { success: false, message: "Failed to save result" };
    }
}

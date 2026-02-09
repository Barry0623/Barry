export interface Exam {
    id: string;
    title: string;
    password?: string;
    startTime?: string; // ISO string
    endTime?: string;   // ISO string
    status: 'Draft' | 'Active' | 'Closed';
}

export interface Question {
    id: string;
    title: string;
    question: string;
    options: {
        a: string;
        b: string;
        c: string;
        d: string;
    };
    answer: 'option_a' | 'option_b' | 'option_c' | 'option_d';
    examId: string;
}

export interface StudentResult {
    studentName: string;
    studentNumber: string;
    examId: string;
    accuracyRate: number;
    answers: Record<string, string>; // questionId -> selectedOption
}

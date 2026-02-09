import { Client } from '@notionhq/client';
import { Exam, Question, StudentResult } from '@/types';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const EXAM_DB_ID = process.env.NOTION_DATABASE_ID_EXAM!;
const QUESTION_DB_ID = process.env.NOTION_DATABASE_ID_QUESTION!;
const STUDENT_DB_ID = process.env.NOTION_DATABASE_ID_STUDENT!;

// ... (existing code)

export type PublicExam = Omit<Exam, 'password'>;

export const getActiveExams = async (): Promise<Exam[]> => {
    if (!EXAM_DB_ID) return [];

    const response = await (notion as any).databases.query({
        database_id: EXAM_DB_ID,
        filter: {
            property: 'status',
            select: {
                equals: 'Active',
            },
        },
    } as any);

    return response.results.map((page: any) => ({
        // ...
        id: page.id,
        title: page.properties.exam_title.title[0]?.plain_text || 'Untitled',
        password: page.properties.password?.rich_text[0]?.plain_text,
        startTime: page.properties.start_time?.date?.start,
        endTime: page.properties.end_time?.date?.end,
        status: page.properties.status?.select?.name as 'Active' | 'Draft' | 'Closed',
    }));
};

export const getQuestions = async (examId: string): Promise<Question[]> => {
    if (!QUESTION_DB_ID) return [];

    const response = await (notion as any).databases.query({
        database_id: QUESTION_DB_ID,
        filter: {
            property: 'exam_db',
            relation: {
                contains: examId,
            },
        },
    } as any);

    return response.results.map((page: any) => ({
        id: page.id,
        title: page.properties.question_title?.title[0]?.plain_text || 'Untitled',
        question: page.properties.question?.rich_text[0]?.plain_text || '',
        options: {
            a: page.properties.option_a?.rich_text[0]?.plain_text || '',
            b: page.properties.option_b?.rich_text[0]?.plain_text || '',
            c: page.properties.option_c?.rich_text[0]?.plain_text || '',
            d: page.properties.option_d?.rich_text[0]?.plain_text || '',
        },
        answer: page.properties.answer?.select?.name as any,
        examId: examId,
    }));
};

export const submitStudentResult = async (result: StudentResult) => {
    if (!STUDENT_DB_ID) throw new Error("Student Database ID not configured");

    await notion.pages.create({
        parent: { database_id: STUDENT_DB_ID },
        properties: {
            student_name: {
                title: [
                    {
                        text: {
                            content: result.studentName,
                        },
                    },
                ],
            },
            student_number: {
                rich_text: [
                    {
                        text: {
                            content: result.studentNumber,
                        },
                    },
                ],
            },
            exam_db: {
                relation: [
                    {
                        id: result.examId,
                    },
                ],
            },
            accuracy_rate: {
                number: result.accuracyRate,
            },
            // created time is automatic in Notion, but we can add a date property if needed
        },
    });
};

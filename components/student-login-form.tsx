'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { verifyExamPassword } from '@/app/actions';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Exam } from '@/types';

type PublicExam = Omit<Exam, 'password'>;

const formSchema = z.object({
    examId: z.string().min(1, '請選擇測驗'),
    password: z.string().min(1, '請輸入密碼'),
    studentName: z.string().min(1, '請輸入姓名'),
    studentNumber: z.string().min(1, '請輸入學號'),
});

export function StudentLoginForm({ exams }: { exams: PublicExam[] }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            examId: '',
            password: '',
            studentName: '',
            studentNumber: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const result = await verifyExamPassword(values.examId, values.password);

            if (result.success) {
                sessionStorage.setItem('studentName', values.studentName);
                sessionStorage.setItem('studentNumber', values.studentNumber);

                toast.success('登入成功！正在進入測驗...');
                router.push(`/quiz/${values.examId}`);
            } else {
                toast.error(result.message || '密碼錯誤');
            }
        } catch (error) {
            toast.error('發生錯誤，請稍後再試');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md">
            {/* Card Container */}
            <div className="bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-800">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">學生登入</h2>
                    <p className="text-zinc-400 text-sm">
                        輸入您的資料開始測驗
                    </p>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* Exam Selection */}
                        <FormField
                            control={form.control}
                            name="examId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300 text-sm font-medium">
                                        選擇測驗
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-12 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                                                <SelectValue placeholder="請選擇測驗" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-zinc-800 border-zinc-700">
                                            {exams.map((exam) => (
                                                <SelectItem
                                                    key={exam.id}
                                                    value={exam.id}
                                                    className="text-white hover:bg-zinc-700 focus:bg-zinc-700"
                                                >
                                                    {exam.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300 text-sm font-medium">
                                        測驗密碼
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="請輸入密碼"
                                            className="bg-zinc-800 border-zinc-700 text-white h-12 rounded-lg placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Student Name */}
                        <FormField
                            control={form.control}
                            name="studentName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300 text-sm font-medium">
                                        姓名
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="請輸入您的姓名"
                                            className="bg-zinc-800 border-zinc-700 text-white h-12 rounded-lg placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Student Number */}
                        <FormField
                            control={form.control}
                            name="studentNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300 text-sm font-medium">
                                        學號
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="請輸入您的學號"
                                            className="bg-zinc-800 border-zinc-700 text-white h-12 rounded-lg placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-all duration-200 mt-6"
                            disabled={isLoading}
                        >
                            {isLoading ? '驗證中...' : '開始測驗'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

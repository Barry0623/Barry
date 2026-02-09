import { getActiveExams } from "@/lib/notion";
import { StudentLoginForm } from "../components/student-login-form";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const exams = await getActiveExams();
  // Strip passwords before sending to client
  const publicExams = exams.map(({ password, ...rest }) => rest);

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2">
            📝 Classroom Quiz
          </h1>
          <p className="text-zinc-400">
            線上課堂測驗系統
          </p>
        </div>

        {/* Login Form */}
        <StudentLoginForm exams={publicExams} />
      </div>
    </main>
  );
}

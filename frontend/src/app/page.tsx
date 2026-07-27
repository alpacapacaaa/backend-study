import TodoBoard from "@/components/TodoBoard";
import FileUploadCard from "@/components/FileUploadCard";
import { API_BASE_URL } from "@/lib/api";

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-8 px-6 py-12 sm:px-10">
        <header>
          <h1 className="text-2xl font-bold">백엔드 스터디 — 1주차</h1>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            Todo API · 필터/정렬 조회 · 파일 업로드/다운로드
          </p>
          <p className="mt-1 text-xs text-black/40 dark:text-white/40">
            API: {API_BASE_URL}{" "}
            <span className="opacity-70">(.env.local의 NEXT_PUBLIC_API_URL로 변경)</span>
          </p>
        </header>

        <TodoBoard />
        <FileUploadCard />
      </main>
    </div>
  );
}

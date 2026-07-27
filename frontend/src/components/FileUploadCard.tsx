"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { ApiError, deleteFile, fileDownloadUrl, uploadFile } from "@/lib/api";
import type { FileMeta } from "@/types";

export default function FileUploadCard() {
  const [uploaded, setUploaded] = useState<FileMeta | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const meta = await uploadFile(file);
      setUploaded(meta);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete() {
    if (!uploaded) return;
    setError(null);
    try {
      await deleteFile(uploaded.id);
      setUploaded(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "삭제에 실패했습니다.");
    }
  }

  return (
    <section className="rounded-xl border border-black/10 dark:border-white/15 p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">파일 업로드/다운로드</h2>
        <p className="text-sm text-black/60 dark:text-white/60">
          이미지 업로드 후 저장된 파일을 다시 받아옵니다. (jpg, jpeg, png, gif, webp)
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        onChange={handleFileChange}
        disabled={uploading}
        className="text-sm"
      />

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {uploading && <p className="text-sm text-black/60 dark:text-white/60">업로드 중...</p>}

      {uploaded && (
        <div className="flex items-start gap-4 rounded-md border border-black/10 dark:border-white/10 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fileDownloadUrl(uploaded.id)}
            alt={uploaded.filename}
            className="h-24 w-24 rounded object-cover"
          />
          <div className="flex-1 min-w-0 text-sm">
            <p className="font-medium truncate">{uploaded.filename}</p>
            <p className="text-black/60 dark:text-white/60">
              {uploaded.mimeType} · {(uploaded.size / 1024).toFixed(1)} KB
            </p>
            <a
              href={fileDownloadUrl(uploaded.id)}
              download={uploaded.filename}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              다운로드
            </a>
            {" · "}
            <button onClick={handleDelete} className="text-red-600 dark:text-red-400 hover:underline">
              삭제
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

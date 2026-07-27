"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ApiError,
  createTodo,
  deleteTodo,
  listTodos,
  updateTodo,
} from "@/lib/api";
import type { CompletedFilter, SortField, SortOrder, Todo } from "@/types";

// <input type="date">는 YYYY-MM-DD 값을 주므로, 명세가 요구하는
// ISO 8601 UTC(Z) 문자열로 변환합니다.
function toIsoDate(dateInput: string): string | null {
  if (!dateInput) return null;
  return new Date(`${dateInput}T00:00:00Z`).toISOString();
}

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TodoBoard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [completedFilter, setCompletedFilter] = useState<CompletedFilter>("all");
  const [sort, setSort] = useState<SortField>("createdAt");
  const [order, setOrder] = useState<SortOrder>("desc");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 생성/토글/삭제 뒤에 쓰는 조용한 새로고침. 목록이 이미 떠 있는 상태에서
  // 전체를 "불러오는 중..."으로 갈아엎지 않기 위해 loading 플래그를 건드리지 않습니다.
  async function silentRefresh() {
    setError(null);
    try {
      const data = await listTodos({ completed: completedFilter, sort, order });
      setTodos(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "목록을 불러오지 못했습니다.");
    }
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listTodos({ completed: completedFilter, sort, order });
        if (!cancelled) setTodos(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "목록을 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [completedFilter, sort, order]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createTodo({
        title: title.trim(),
        description: description.trim() || null,
        dueDate: toIsoDate(dueDate),
      });
      setTitle("");
      setDescription("");
      setDueDate("");
      await silentRefresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "생성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(todo: Todo) {
    setError(null);
    try {
      await updateTodo(todo.id, { completed: !todo.completed });
      await silentRefresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "수정에 실패했습니다.");
    }
  }

  async function handleDelete(todo: Todo) {
    setError(null);
    try {
      await deleteTodo(todo.id);
      await silentRefresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "삭제에 실패했습니다.");
    }
  }

  return (
    <section className="rounded-xl border border-black/10 dark:border-white/15 p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Todo</h2>
        <p className="text-sm text-black/60 dark:text-white/60">
          생성/조회/수정/삭제 + 완료 여부 필터, 날짜순 정렬
        </p>
      </div>

      <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <input
          type="text"
          placeholder="할 일 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="flex-1 rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="설명 (선택)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          추가
        </button>
      </form>

      <div className="flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2">
          완료 여부
          <select
            value={completedFilter}
            onChange={(e) => setCompletedFilter(e.target.value as CompletedFilter)}
            className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-2 py-1"
          >
            <option value="all">전체</option>
            <option value="incomplete">미완료</option>
            <option value="completed">완료</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          정렬 기준
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortField)}
            className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-2 py-1"
          >
            <option value="createdAt">생성일</option>
            <option value="dueDate">마감일</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          순서
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as SortOrder)}
            className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-2 py-1"
          >
            <option value="desc">최신순</option>
            <option value="asc">오래된순</option>
          </select>
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-black/60 dark:text-white/60">불러오는 중...</p>
      ) : todos.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">할 일이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-start gap-3 rounded-md border border-black/10 dark:border-white/10 px-3 py-2"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${todo.completed ? "line-through opacity-50" : ""}`}>
                  {todo.title}
                </p>
                {todo.description && (
                  <p className="text-xs text-black/60 dark:text-white/60">{todo.description}</p>
                )}
                <p className="text-xs text-black/40 dark:text-white/40">
                  마감: {formatDate(todo.dueDate)} · 생성: {formatDate(todo.createdAt)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(todo)}
                className="text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

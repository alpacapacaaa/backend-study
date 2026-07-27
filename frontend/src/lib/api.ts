import type {
  CompletedFilter,
  FileMeta,
  SortField,
  SortOrder,
  Todo,
  TodoCreateInput,
  TodoUpdateInput,
} from "@/types";

// mock 서버든 실제 백엔드든 이 값만 바꾸면 그대로 붙습니다.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// openapi.yaml 공통 에러 포맷 { "error": "메시지" } 을 그대로 파싱합니다.
async function handle<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : `요청이 실패했습니다. (HTTP ${res.status})`;
    throw new ApiError(res.status, message);
  }

  return data as T;
}

export interface ListTodosParams {
  completed?: CompletedFilter;
  sort?: SortField;
  order?: SortOrder;
}

export async function listTodos(params: ListTodosParams = {}): Promise<Todo[]> {
  const query = new URLSearchParams();
  if (params.completed && params.completed !== "all") {
    query.set("completed", params.completed === "completed" ? "true" : "false");
  }
  if (params.sort) query.set("sort", params.sort);
  if (params.order) query.set("order", params.order);

  const qs = query.toString();
  const res = await fetch(`${API_BASE_URL}/todos${qs ? `?${qs}` : ""}`, {
    cache: "no-store",
  });
  return handle<Todo[]>(res);
}

export async function createTodo(input: TodoCreateInput): Promise<Todo> {
  const res = await fetch(`${API_BASE_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handle<Todo>(res);
}

export async function updateTodo(
  id: string,
  input: TodoUpdateInput
): Promise<Todo> {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handle<Todo>(res);
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, { method: "DELETE" });
  return handle<void>(res);
}

export async function uploadFile(file: File): Promise<FileMeta> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE_URL}/files`, {
    method: "POST",
    body: form,
  });
  return handle<FileMeta>(res);
}

export function fileDownloadUrl(fileId: string): string {
  return `${API_BASE_URL}/files/${fileId}`;
}

export async function deleteFile(fileId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/files/${fileId}`, {
    method: "DELETE",
  });
  return handle<void>(res);
}

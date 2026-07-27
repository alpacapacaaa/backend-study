// openapi.yaml의 components.schemas와 1:1로 대응하는 타입 정의

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null; // ISO 8601, UTC
  createdAt: string; // ISO 8601, UTC
  updatedAt: string; // ISO 8601, UTC
}

export interface TodoCreateInput {
  title: string;
  description?: string | null;
  dueDate?: string | null;
}

export interface TodoUpdateInput {
  title?: string;
  description?: string | null;
  completed?: boolean;
  dueDate?: string | null;
}

export type CompletedFilter = "all" | "completed" | "incomplete";
export type SortField = "createdAt" | "dueDate";
export type SortOrder = "asc" | "desc";

export interface FileMeta {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

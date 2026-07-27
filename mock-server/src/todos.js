const { randomUUID } = require("crypto");
const { sendError } = require("./errors");

// 인메모리 저장소. 서버를 재시작하면 초기화됩니다.
const todos = new Map();

function nowIso() {
  return new Date().toISOString().replace(/\.\d+Z$/, "Z");
}

function seed() {
  const sample = {
    id: randomUUID(),
    title: "OpenAPI 명세 작성하기",
    description: "1주차 명세 초안 작성",
    completed: false,
    dueDate: "2026-08-01T00:00:00Z",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  todos.set(sample.id, sample);
}
seed();

function list(req, res) {
  const { completed, sort = "createdAt", order = "desc" } = req.query;

  if (completed !== undefined && completed !== "true" && completed !== "false") {
    return sendError(res, 400, "completed 파라미터는 true 또는 false 여야 합니다.");
  }
  if (sort !== "createdAt" && sort !== "dueDate") {
    return sendError(res, 400, "sort 파라미터는 createdAt 또는 dueDate 여야 합니다.");
  }
  if (order !== "asc" && order !== "desc") {
    return sendError(res, 400, "order 파라미터는 asc 또는 desc 여야 합니다.");
  }

  let result = Array.from(todos.values());

  if (completed !== undefined) {
    const flag = completed === "true";
    result = result.filter((t) => t.completed === flag);
  }

  result.sort((a, b) => {
    const av = a[sort] ? new Date(a[sort]).getTime() : 0;
    const bv = b[sort] ? new Date(b[sort]).getTime() : 0;
    return order === "asc" ? av - bv : bv - av;
  });

  res.json(result);
}

function create(req, res) {
  const { title, description, dueDate } = req.body || {};

  if (typeof title !== "string" || title.trim().length === 0) {
    return sendError(res, 400, "title은 비어있지 않은 문자열이어야 합니다.");
  }

  const timestamp = nowIso();
  const todo = {
    id: randomUUID(),
    title,
    description: description ?? null,
    completed: false,
    dueDate: dueDate ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  todos.set(todo.id, todo);
  res.status(201).json(todo);
}

function getOne(req, res) {
  const todo = todos.get(req.params.todoId);
  if (!todo) return sendError(res, 404, "해당 id의 todo를 찾을 수 없습니다.");
  res.json(todo);
}

function update(req, res) {
  const todo = todos.get(req.params.todoId);
  if (!todo) return sendError(res, 404, "해당 id의 todo를 찾을 수 없습니다.");

  const { title, description, completed, dueDate } = req.body || {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return sendError(res, 400, "title은 비어있지 않은 문자열이어야 합니다.");
    }
    todo.title = title;
  }
  if (description !== undefined) todo.description = description;
  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return sendError(res, 400, "completed는 boolean이어야 합니다.");
    }
    todo.completed = completed;
  }
  if (dueDate !== undefined) todo.dueDate = dueDate;

  todo.updatedAt = nowIso();
  res.json(todo);
}

function remove(req, res) {
  if (!todos.has(req.params.todoId)) {
    return sendError(res, 404, "해당 id의 todo를 찾을 수 없습니다.");
  }
  todos.delete(req.params.todoId);
  res.status(204).send();
}

module.exports = { list, create, getOne, update, remove };

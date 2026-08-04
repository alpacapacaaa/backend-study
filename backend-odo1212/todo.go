package main

import (

	"net/http"
	"sync"
	"time"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"

)

// openapi.yaml components.schemas.Todo 와 대응
type Todo struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	Description *string `json:"description"`
	Completed   bool    `json:"completed"`
	DueDate     *string `json:"dueDate"`
	CreatedAt   string  `json:"createdAt"`
	UpdatedAt   string  `json:"updatedAt"`
}

// POST 요청 바디 모양. openapi.yaml의 TodoCreateRequest 스키마와 대응합니다.
type TodoCreateRequest struct {
	Title       string  `json:"title"`
	Description *string `json:"description"`
	DueDate     *string `json:"dueDate"`
}

// PATCH 요청 바디 모양. 전부 선택 필드입니다 (부분 업데이트).
type TodoUpdateRequest struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	Completed   *bool   `json:"completed"`
	DueDate     *string `json:"dueDate"`
}

// 인메모리 저장소. DB 없이 여기에 담아두면 됩니다. (서버 재시작하면 초기화됨)
var (
	todos   = map[string]Todo{}
	todosMu sync.Mutex
)

// GET /todos
// 참고: openapi.yaml 의 GET /todos, mock-server/src/todos.js 의 list()
func listTodos(c echo.Context) error {
	// TODO 1: completed 쿼리 파라미터로 필터링하세요 (없으면 전체 반환).
	// TODO 2: sort("createdAt" | "dueDate"), order("asc" | "desc")로 정렬하세요.
	//         그 외 값이 들어오면 400을 반환하세요. (echo.NewHTTPError(http.StatusBadRequest, "..."))
	return notImplemented("GET /todos (필터/정렬)")
}

// POST /todos
func createTodo(c echo.Context) error {
	var req TodoCreateRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "요청 본문을 읽을 수 없습니다.")
	}

	// TODO 1: title이 비어있으면 400을 반환하세여잉
	if req.Title == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "title은 필수입니다.")
	}

	// TODO 2: dueDate 문자열이 ISO 8601 형식인지 확인하세여잉 (아님 400)
	if req.DueDate != nil {
		if _, err := time.Parse(time.RFC3339, *req.DueDate); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "dueDate는 ISO 8601 형식이어야 합니다.")
		}
	}

	// TODO 3: id/createdAt/updatedAt을 채운 Todo를 만들어 todos에 저장하고
	//         201로 반환하시라고요
	now := time.Now().UTC().Format(time.RFC3339)
	todo := Todo{
		ID:          uuid.NewString(),
		Title:       req.Title,
		Description: req.Description,
		Completed:   false,
		DueDate:     req.DueDate,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	todosMu.Lock()
	todos[todo.ID] = todo
	todosMu.Unlock()

	return c.JSON(http.StatusCreated, todo)
}
}

// GET /todos/:id
func getTodo(c echo.Context) error {
	// TODO: id로 찾아서 반환하고, 없으면 404를 반환하세요.
	return notImplemented("GET /todos/:id (단건 조회)")
}

// PATCH /todos/:id
func updateTodo(c echo.Context) error {
	// TODO 1: id로 기존 Todo를 찾고, 없으면 404를 반환하세요.
	// TODO 2: 요청 바디에 들어있는 필드만 갱신하세요 (nil인 필드는 기존 값 유지).
	// TODO 3: updatedAt을 현재 시각으로 갱신하세요.
	return notImplemented("PATCH /todos/:id (부분 수정)")
}

// DELETE /todos/:id
func deleteTodo(c echo.Context) error {
	// TODO: id로 찾아서 삭제하고, 없으면 404를 반환하세요.
	//       성공 시 204를 반환하세요. (c.NoContent(http.StatusNoContent))
	return notImplemented("DELETE /todos/:id (삭제)")
}
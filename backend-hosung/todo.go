package main

import (
	"net/http"
	"sort"
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
	completedParam := c.QueryParam("completed")
	sortBy := c.QueryParam("sort")
	order := c.QueryParam("order")

	if completedParam != "" &&
		completedParam != "true" &&
		completedParam != "false" {
		return echo.NewHTTPError(
			http.StatusBadRequest,
			"completed must be true or false",
		)
	}

	// 기본값 설정함
	if sortBy == "" {
		sortBy = "createdAt"
	}

	if order == "" {
		order = "desc"
	}

	if sortBy != "createdAt" && sortBy != "dueDate" {
		return echo.NewHTTPError(
			http.StatusBadRequest,
			"sort must be createdAt or dueDate",
		)
	}

	if order != "asc" && order != "desc" {
		return echo.NewHTTPError(
			http.StatusBadRequest,
			"order must be asc or desc",
		)
	}

	todosMu.Lock()

	result := make([]Todo, 0)

	for _, todo := range todos {
		if completedParam == "true" && !todo.Completed {
			continue
		}

		if completedParam == "false" && todo.Completed {
			continue
		}

		result = append(result, todo)
	}

	// 공유 map을 모두 읽고 여기서 잠금을 푼다.
	todosMu.Unlock()

	sort.SliceStable(result, func(i, j int) bool {
		left := result[i].CreatedAt
		right := result[j].CreatedAt

		if sortBy == "dueDate" {
			left = ""
			right = ""

			// DueDate는 포인터라 nil일 수 있으므로 확인 후 값을 꺼낸다.
			if result[i].DueDate != nil {
				left = *result[i].DueDate
			}

			if result[j].DueDate != nil {
				right = *result[j].DueDate
			}
		}

		if order == "asc" {
			return left < right
		}

		return left > right
	})

	return c.JSON(http.StatusOK, result)
}

// POST /todos
func createTodo(c echo.Context) error {
	var req TodoCreateRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request")
	}

	// TODO 1: title이 비어있으면 400을 반환하세요.
	if req.Title == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "title is required")
	}
	// TODO 2: dueDate 문자열이 ISO 8601 형식인지 확인하세요 (아니면 400).
	if req.DueDate != nil {
		if _, err := time.Parse(time.RFC3339, *req.DueDate); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid dueDate")
		}
	}
	// 현재 UTC 시간 생성
	now := time.Now().UTC().Format(time.RFC3339)

	// TODO 3: id/createdAt/updatedAt을 채운 Todo를 만들어 todos에 저장하고
	//         201로 반환하세요. (c.JSON(http.StatusCreated, todo))
	todo := Todo{
		ID:          uuid.NewString(),
		Title:       req.Title,
		Description: req.Description,
		Completed:   false,
		DueDate:     req.DueDate,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	// map에 저장
	todosMu.Lock()
	todos[todo.ID] = todo
	todosMu.Unlock()
	// 201 Created 응답
	return c.JSON(http.StatusCreated, todo)
}

// GET /todos/:id
func getTodo(c echo.Context) error {
	// TODO: id로 찾아서 반환하고, 없으면 404를 반환하세요.
	id := c.Param("id")
	todosMu.Lock()
	// value 랑 bool로 존재여부 반환함
	todo, exists := todos[id]
	todosMu.Unlock()

	if !exists {
		return echo.NewHTTPError(http.StatusNotFound, "todo not found")
	}
	return c.JSON(http.StatusOK, todo)
}

// PATCH /todos/:id
func updateTodo(c echo.Context) error {
	// TODO 1: id로 기존 Todo를 찾고, 없으면 404를 반환하세요.
	id := c.Param("id")

	var req TodoUpdateRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request")
	}
	todosMu.Lock()
	defer todosMu.Unlock()

	todo, exists := todos[id]
	if !exists {
		return echo.NewHTTPError(http.StatusNotFound, "todo not found")
	}
	// TODO 2: 요청 바디에 들어있는 필드만 갱신하세요 (nil인 필드는 기존 값 유지).
	if req.Title != nil {
		todo.Title = *req.Title
	}

	if req.Description != nil {
		todo.Description = req.Description
	}

	if req.Completed != nil {
		todo.Completed = *req.Completed
	}

	if req.DueDate != nil {
		if _, err := time.Parse(time.RFC3339, *req.DueDate); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid dueDate")
		}
		todo.DueDate = req.DueDate
	}
	// TODO 3: updatedAt을 현재 시각으로 갱신하세요.
	todo.UpdatedAt = time.Now().UTC().Format(time.RFC3339)

	todos[id] = todo

	return c.JSON(http.StatusOK, todo)
}

// DELETE /todos/:id
func deleteTodo(c echo.Context) error {
	// TODO: id로 찾아서 삭제하고, 없으면 404를 반환하세요.
	id := c.Param("id")

	todosMu.Lock()
	defer todosMu.Unlock()

	if _, exists := todos[id]; !exists {
		return echo.NewHTTPError(http.StatusNotFound, "todo not found")
	}

	delete(todos, id)
	//       성공 시 204를 반환하세요. (c.NoContent(http.StatusNoContent))
	return c.NoContent(http.StatusNoContent)
}

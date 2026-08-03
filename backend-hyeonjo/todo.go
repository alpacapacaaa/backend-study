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
	var filteredTodos = make([]Todo, 0) //new로 하면 초기화 안 됨

	// TODO 1: completed 쿼리 파라미터로 필터링하세요 (없으면 전체 반환).
	completed := c.QueryParam("completed")

	todosMu.Lock()
	for _, todo := range todos {
		if completed == "true" && todo.Completed {
			filteredTodos = append(filteredTodos, todo)
		} else if completed == "false" && !todo.Completed {
			filteredTodos = append(filteredTodos, todo)
		} else if completed == "" {
			filteredTodos = append(filteredTodos, todo)
		}
	}
	todosMu.Unlock()

	// TODO 2: sort("createdAt" | "dueDate"), order("asc" | "desc")로 정렬하세요.
	//         그 외 값이 들어오면 400을 반환하세요. (echo.NewHTTPError(http.StatusBadRequest, "..."))
	sortBy := c.QueryParam("sort")
	orderBy := c.QueryParam("order")

	if sortBy != "createdAt" && sortBy != "dueDate" && sortBy != "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid sort parameter")
	}

	if orderBy != "asc" && orderBy != "desc" && orderBy != "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid order parameter")
	}

	sort.Slice(filteredTodos, func(i, j int) bool {
		switch sortBy {
		case "dueDate":
			dueDate1, _ := time.Parse(time.RFC3339, *filteredTodos[i].DueDate)
			dueDate2, _ := time.Parse(time.RFC3339, *filteredTodos[j].DueDate)

			if orderBy == "desc" {
				return dueDate1.After(dueDate2)
			} else {
				return dueDate1.Before(dueDate2)
			}

		case "createdAt":
			createdAt1, _ := time.Parse(time.RFC3339, filteredTodos[i].CreatedAt)
			createdAt2, _ := time.Parse(time.RFC3339, filteredTodos[j].CreatedAt)

			if orderBy == "desc" {
				return createdAt1.After(createdAt2)
			} else {
				return createdAt1.Before(createdAt2)
			}
		}
		return false
	})

	return c.JSON(http.StatusOK, filteredTodos)
}

// POST /todos
func createTodo(c echo.Context) error {
	req := new(TodoCreateRequest)

	if err := c.Bind(req); err != nil {
		return err
	}

	// TODO 1: title이 비어있으면 400을 반환하세요.
	if req.Title == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Title is required.")
	}

	// TODO 2: dueDate 문자열이 ISO 8601 형식인지 확인하세요 (아니면 400).
	// RFC3339가 ISO8601의 하위 집합이라고 해서 사용
	if req.DueDate != nil {
		if _, err := time.Parse(time.RFC3339, *req.DueDate); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Wrong date format. Use ISO 8601 format.")
		}
	}

	// TODO 3: id/createdAt/updatedAt을 채운 Todo를 만들어 todos에 저장하고
	//         201로 반환하세요. (c.JSON(http.StatusCreated, todo))
	newTodo := Todo{
		ID:          uuid.New().String(),
		Title:       req.Title,
		Description: req.Description,
		DueDate:     req.DueDate,
		Completed:   false,
		CreatedAt:   time.Now().Format(time.RFC3339),
		UpdatedAt:   time.Now().Format(time.RFC3339),
	}

	todosMu.Lock()
	todos[newTodo.ID] = newTodo
	todosMu.Unlock()

	return c.JSON(http.StatusCreated, newTodo.ID)
}

// GET /todos/:id
func getTodo(c echo.Context) error {
	// TODO: id로 찾아서 반환하고, 없으면 404를 반환하세요.
	id := c.Param("id")
	todo, ok := todos[id]
	if !ok {
		return echo.NewHTTPError(http.StatusNotFound, "Todo not found")
	}
	return c.JSON(http.StatusOK, todo)
}

// PATCH /todos/:id
func updateTodo(c echo.Context) error {
	todosMu.Lock()
	defer todosMu.Unlock()

	// TODO 1: id로 기존 Todo를 찾고, 없으면 404를 반환하세요.\
	id := c.Param("id")
	todo, ok := todos[id]
	if !ok {
		return echo.NewHTTPError(http.StatusNotFound, "Todo not found")
	}

	// TODO 2: 요청 바디에 들어있는 필드만 갱신하세요 (nil인 필드는 기존 값 유지).
	req := new(TodoUpdateRequest)
	if err := c.Bind(req); err != nil {
		return err
	}

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
			return echo.NewHTTPError(http.StatusBadRequest, "Wrong date format. Use ISO 8601 format.")
		}
		todo.DueDate = req.DueDate
	}

	// TODO 3: updatedAt을 현재 시각으로 갱신하세요.
	todo.UpdatedAt = time.Now().Format(time.RFC3339)
	todos[todo.ID] = todo

	return c.JSON(http.StatusOK, todo)
}

// DELETE /todos/:id
func deleteTodo(c echo.Context) error {
	todosMu.Lock()
	defer todosMu.Unlock()

	// TODO: id로 찾아서 삭제하고, 없으면 404를 반환하세요.
	id := c.Param("id")
	_, ok := todos[id]
	if !ok {
		return echo.NewHTTPError(http.StatusNotFound, "Todo not found")
	}

	//       성공 시 204를 반환하세요. (c.NoContent(http.StatusNoContent))
	delete(todos, id)

	return c.NoContent(http.StatusNoContent)
}

package main

import (
	"fmt"
	"net/http"
	"sort"
	"sync"
	"time"

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
	completed := c.QueryParam("completed")

	// 런타임에러 발생으로 var result []Todo -> result := []Todo{}로 변경
	result := []Todo{}
	for _, todo := range todos {
		if completed == "true" && !todo.Completed {
			continue
		}
		if completed == "false" && todo.Completed {
			continue
		}
		result = append(result, todo)
	}
	// TODO 2: sort("createdAt" | "dueDate"), order("asc" | "desc")로 정렬하세요.
	//         그 외 값이 들어오면 400을 반환하세요. (echo.NewHTTPError(http.StatusBadRequest, "..."))
	sortField := c.QueryParam("sort")
	if sortField == "" {
		sortField = "createdAt"
	}
	if sortField != "createdAt" && sortField != "dueDate" {
		return echo.NewHTTPError(http.StatusBadRequest, "sort 값이 올바르지 않습니다.")
	}

	order := c.QueryParam("order")
	if order == "" {
		order = "desc"
	}
	if order != "asc" && order != "desc" {
		return echo.NewHTTPError(http.StatusBadRequest, "order 값이 올바르지 않습니다.")
	}

	if sortField == "createdAt" { // createdAt 기준 정렬
		sort.Slice(result, func(i, j int) bool { // for문으로 정렬하는 것보다 sort.Slice를 쓰는게 Go스럽다고 합니다..
			if order == "asc" {
				return result[i].CreatedAt < result[j].CreatedAt
			}
			return result[i].CreatedAt > result[j].CreatedAt
		})
	} else { // dueDate 기준 정렬
		sort.Slice(result, func(i, j int) bool {
			a, b := "", ""
			if result[i].DueDate != nil {
				a = *result[i].DueDate
			}
			if result[j].DueDate != nil {
				b = *result[j].DueDate
			}
			if order == "asc" {
				return a < b
			}
			return a > b
		})
	}

	return c.JSON(http.StatusOK, result)
}

// POST /todos
func createTodo(c echo.Context) error {
	req := TodoCreateRequest{}
	// 요렇게 쓰는게 Go 코드 작성 관례라고 하네요..
	if err := c.Bind(&req); err != nil { // Bind를 통해 body를 읽고 json 파싱을 수행
		// 참고로 Bind는 Content-Type 헤더 보고 맞는 파서를 알아서 골라 써줌 ㄷㄷ
		return echo.NewHTTPError(http.StatusBadRequest, "잘못된 요청 바디입니다.")
	}
	// TODO 1: title이 비어있으면 400을 반환하세요.
	if req.Title == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "title은 필수 입력값입니다.")
	}
	// TODO 2: dueDate 문자열이 ISO 8601 형식인지 확인하세요 (아니면 400).
	if req.DueDate != nil {
		_, err := time.Parse(time.RFC3339, *req.DueDate) // Go에서 _식별자(블랭크 식별자)로 리턴값 버리기
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "dueDate 형식이 올바르지 않습니다.")
		}
	}
	// TODO 3: id/createdAt/updatedAt을 채운 Todo를 만들어 todos에 저장하고
	//         201로 반환하세요. (c.JSON(http.StatusCreated, todo))
	now := time.Now().Format(time.RFC3339)
	todo := Todo{
		ID:          fmt.Sprintf("%d", time.Now().UnixNano()), //UnixNano를 이용해 고유한 ID 생성
		Title:       req.Title,
		Description: req.Description,
		Completed:   false,
		DueDate:     req.DueDate,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
	//DB에 저장하지 않고 인메모리 저장소에 저장할 때는 뮤텍스 락이 필요한데 어차피 DB에 곧 넣을거니 스킵하겠습니다..
	todos[todo.ID] = todo
	return c.JSON(http.StatusCreated, todo)
}

// GET /todos/:id
func getTodo(c echo.Context) error {
	// TODO: id로 찾아서 반환하고, 없으면 404를 반환하세요.
	id := c.Param("id")

	todo, ok := todos[id]
	if !ok { // 예외처리가 아니고 존재하지 않는 경우를 분기 처리 했기 때문에 nil 대신 ok를 사용했습니다!!
		return echo.NewHTTPError(http.StatusNotFound, "해당 id의 Todo를 찾을 수 없습니다.")
	}

	return c.JSON(http.StatusOK, todo)
}

// PATCH /todos/:id
func updateTodo(c echo.Context) error {
	id := c.Param("id")
	// TODO 1: id로 기존 Todo를 찾고, 없으면 404를 반환하세요.
	todo, ok := todos[id] // 얕은복사
	if !ok {
		return echo.NewHTTPError(http.StatusNotFound, "해당 id의 Todo를 찾을 수 없습니다.")
	}

	var req TodoUpdateRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "잘못된 요청 바디입니다.")
	}
	// TODO 2: 요청 바디에 들어있는 필드만 갱신하세요 (nil인 필드는 기존 값 유지).
	if req.Title != nil {
		if *req.Title == "" {
			return echo.NewHTTPError(http.StatusBadRequest, "title은 빈 문자열일 수 없습니다.")
		}
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
			return echo.NewHTTPError(http.StatusBadRequest, "dueDate 형식이 올바르지 않습니다.")
		}
		todo.DueDate = req.DueDate
	}
	// TODO 3: updatedAt을 현재 시각으로 갱신하세요.
	todo.UpdatedAt = time.Now().Format(time.RFC3339)
	todos[id] = todo // 맵 안의 값을 읽어서 고친 후 다시 넣어야 합니다. (Go의 맵은 값 타입이므로)

	return c.JSON(http.StatusOK, todo)
}

// DELETE /todos/:id
func deleteTodo(c echo.Context) error {
	// TODO: id로 찾아서 삭제하고, 없으면 404를 반환하세요.
	//       성공 시 204를 반환하세요. (c.NoContent(http.StatusNoContent))
	id := c.Param("id")

	_, ok := todos[id]
	if !ok {
		return echo.NewHTTPError(http.StatusNotFound, "해당 id의 Todo를 찾을 수 없습니다.")
	}
	delete(todos, id)
	return c.NoContent(http.StatusNoContent)
}

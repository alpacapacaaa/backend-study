package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()
	e.HTTPErrorHandler = customHTTPErrorHandler

	// openapi.yaml 상단 CORS 정책: 프론트 origin(http://localhost:3000)을 반드시 허용
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "http://localhost:8001", "http://127.0.0.1:8001"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPatch, http.MethodPut, http.MethodDelete, http.MethodOptions},
		AllowHeaders: []string{"Content-Type", "Authorization"},
	}))

	// 파일 업로드 용량 제한 (openapi.yaml Files 명세와 맞춤)
	e.Use(middleware.BodyLimit("10M"))

	e.GET("/todos", listTodos)
	e.POST("/todos", createTodo)
	e.GET("/todos/:id", getTodo)
	e.PATCH("/todos/:id", updateTodo)
	e.DELETE("/todos/:id", deleteTodo)

	e.POST("/files", uploadFile)
	e.GET("/files/:id", downloadFile)
	e.DELETE("/files/:id", deleteFile)

	// 2주차: 인증 API
	e.POST("/auth/register", registerUser)
	e.POST("/auth/login", loginUser)

	// 본인 포트로 바꾸세요. openapi.yaml의 servers 목록에도 추가해두면 좋습니다.
	// (다른 참여자와 겹치지 않는 포트를 쓰세요)
	e.Logger.Fatal(e.Start(":8090"))
}

package main

import (
	"io"
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

// openapi.yaml components.schemas.FileMeta 와 대응
type FileMeta struct {
	ID        string `json:"id"`
	Filename  string `json:"filename"`
	MimeType  string `json:"mimeType"`
	Size      int64  `json:"size"`
	URL       string `json:"url"`
	CreatedAt string `json:"createdAt"`
}

// 업로드된 파일의 메타데이터 + 바이너리를 함께 담아둘 내부 저장 구조.
// 그대로 써도 되고, 필요하면 구조를 바꿔도 됩니다.
type storedFile struct {
	ID        string
	Filename  string
	MimeType  string
	Data      []byte
	CreatedAt string
}

// openapi.yaml이 허용하는 이미지 MIME 타입
var allowedMimeTypes = map[string]bool{
	"image/png":  true,
	"image/jpeg": true,
	"image/gif":  true,
	"image/webp": true,
}

// 인메모리 저장소. (서버 재시작하면 초기화됨)
var (
	files   = map[string]storedFile{}
	filesMu sync.Mutex
)

// POST /files
// 참고: openapi.yaml 의 POST /files, mock-server/src/files.js 의 uploadFile()
func uploadFile(c echo.Context) error {
	// TODO 1: "file" 폼 필드를 받으세요 (c.FormFile("file")). 없으면 400을 반환하세요.
	reqHeader, err := c.FormFile("file")
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "File is required")
	}

	// TODO 2: 파일의 MIME 타입이 allowedMimeTypes에 없으면 400을 반환하세요.
	mimeType := reqHeader.Header.Get("Content-Type")
	if !allowedMimeTypes[mimeType] {
		return echo.NewHTTPError(http.StatusBadRequest, "File type not allowed")
	}

	// TODO 3: id를 발급하고 파일 내용을 읽어 files에 저장한 뒤,
	//         FileMeta를 201로 반환하세요. (c.JSON(http.StatusCreated, meta))
	id := uuid.New().String()

	reqFile, err := reqHeader.Open()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal Server Error")
	}
	defer reqFile.Close()

	// 공식 문서에 있는거랑 뭐가 다른거지??
	fileBytes, err := io.ReadAll(reqFile)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal Server Error")
	}

	now := time.Now().Format(time.RFC3339)

	filesMu.Lock()
	files[id] = storedFile{
		ID:        id,
		Filename:  reqHeader.Filename,
		MimeType:  mimeType,
		Data:      fileBytes,
		CreatedAt: now,
	}
	filesMu.Unlock()

	metaData := FileMeta{
		ID:        id,
		Filename:  reqHeader.Filename,
		MimeType:  mimeType,
		Size:      reqHeader.Size,
		URL:       "/files/" + id,
		CreatedAt: now,
	}

	return c.JSON(http.StatusOK, metaData)
}

// GET /files/:id
func downloadFile(c echo.Context) error {
	// TODO: id로 저장된 파일을 찾아서 반환하세요 (없으면 404).
	//       c.Blob(http.StatusOK, mimeType, data) 를 사용하면 편합니다.
	id := c.Param("id")
	file, ok := files[id]
	if !ok {
		return echo.NewHTTPError(http.StatusNotFound, "File not found")
	}

	return c.Blob(http.StatusOK, file.MimeType, file.Data)
}

// DELETE /files/:id
func deleteFile(c echo.Context) error {
	// TODO: id로 찾아서 삭제하고, 없으면 404를 반환하세요.
	//       성공 시 204를 반환하세요.
	id := c.Param("id")
	_, ok := files[id]
	if !ok {
		return echo.NewHTTPError(http.StatusNotFound, "File not found")
	}

	filesMu.Lock()
	delete(files, id)
	filesMu.Unlock()

	return c.NoContent(http.StatusNoContent)
}

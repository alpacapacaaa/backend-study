package main

import (
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"

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
	// TODO 1: "file" 폼 필드를 받으세요. 없으면 400을 반환하세요.
	fileHeader, err := c.FormFile("file")
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "file 필드를 주세요!!.")
	}

	// TODO 2: 파일의 MIME 타입이 allowedMimeTypes에 없으면 400을 반환하세요.
	mimeType := fileHeader.Header.Get("Content-Type")
	if !allowedMimeTypes[mimeType] {
		return echo.NewHTTPError(http.StatusBadRequest, "허용되지 않는 파일 형식입니다: "+mimeType)
	}

	// TODO 3: id를 발급하고 파일 내용을 읽어 files에 저장한 뒤, FileMeta를 201로 반환하세요.
	src, err := fileHeader.Open()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "파일을 열 수 없습니다.")
	}
	defer src.Close() // 파일을 열고 다 쓰고 닫아야 하는데 매번 close를 쓰지 않고 defer로 처리하면 굿

	data, err := io.ReadAll(src)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "파일을 읽을 수 없습니다.")
	}

	id := fmt.Sprintf("%d", time.Now().UnixNano())
	now := time.Now().Format(time.RFC3339)

	files[id] = storedFile{ // 서버가 이 파일을 계속 갖고 있기 위해 저장
		ID:        id,
		Filename:  fileHeader.Filename,
		MimeType:  mimeType,
		Data:      data,
		CreatedAt: now,
	}

	meta := FileMeta{ // 클라이언트에게 반환할 메타데이터(API contract를 위함)
		ID:        id,
		Filename:  fileHeader.Filename,
		MimeType:  mimeType,
		Size:      fileHeader.Size,
		URL:       "/files/" + id,
		CreatedAt: now,
	}
	// 둘을 분리하지 않으면 서버가 갖고 있는 정보가 클라이언트에 노출될 수도 있음..?

	return c.JSON(http.StatusCreated, meta) // 명세를 따라갔습니다..
}

// GET /files/:id
func downloadFile(c echo.Context) error {
	id := c.Param("id")
	// TODO: id로 저장된 파일을 찾아서 반환하세요 (없으면 404).
	//       c.Blob(http.StatusOK, mimeType, data) 를 사용하면 편합니다.
	file, ok := files[id]
	if !ok {
		return echo.NewHTTPError(http.StatusNotFound, "해당 id의 파일을 찾을 수 없습니다.")
	}

	// 리턴 값이 파일이기 때문에 Blob을 사용하여 파일 데이터를 반환
	return c.Blob(http.StatusOK, file.MimeType, file.Data)
}

// DELETE /files/:id
func deleteFile(c echo.Context) error {
	// TODO: id로 찾아서 삭제하고, 없으면 404를 반환하세요.
	//       성공 시 204를 반환하세요.
	id := c.Param("id")
	_, ok := files[id] // 파일 내용은 받지 않아도 되니 블랭크 처리

	if !ok {
		return echo.NewHTTPError(http.StatusNotFound, "해당 id의 파일을 찾을 수 없습니다.")
	}

	delete(files, id)
	return c.NoContent(http.StatusNoContent)
}

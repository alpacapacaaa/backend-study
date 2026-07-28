# 1주차 API 명세 (텍스트 버전)

> 이 문서는 [`openapi.yaml`](./openapi.yaml)의 1주차 범위를 사람이 읽기 편한
> 텍스트 형식으로 다시 정리한 것입니다. **원본은 항상
> `openapi.yaml`이며**, 이 문서는 참고용 요약본입니다. 둘이 어긋나면
> `openapi.yaml`을 따르세요.

1주차 기능: ① Todo API (CRUD) ② 필터/정렬 조회 ③ 파일 업로드/다운로드

- 버전: 1.0.0
- 예시 서버: `http://localhost:8080`(Go+Echo), `http://localhost:8081`(Spring Boot),
  `http://localhost:8082`(그 외, 본인 포트로 자유롭게 변경 가능)
- 실제 접속 주소는 프론트엔드의 `NEXT_PUBLIC_API_URL` 환경변수로 지정합니다.

## 공통 규칙 (모든 엔드포인트 필수 준수)

### CORS

모든 백엔드 구현체는 반드시 프론트엔드 origin(`http://localhost:3000`)을 CORS로 허용해야 합니다.

- `Access-Control-Allow-Origin: http://localhost:3000`
- `Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`
- 2주차 이후 인증 기능이 추가되면 `Authorization` 헤더 허용이 반드시 필요합니다.

### 에러 응답 포맷

성공/실패와 무관하게 에러가 발생하면 항상 아래 형태의 JSON 하나로만 응답합니다.

```json
{ "error": "사람이 읽을 수 있는 에러 메시지" }
```

- HTTP 상태 코드로 에러 종류(400/401/403/404/409/500 등)를 구분합니다.
- 바디의 형태 자체는 절대 바꾸지 않습니다. (`errors` 배열, `message` 필드 등 금지)

### 날짜/시간 포맷

모든 날짜/시간 값은 ISO 8601, UTC(`Z`) 형식의 문자열로 표현합니다.

- 예: `2026-07-27T10:00:00Z`
- 타임존을 생략하거나 로컬 시간으로 응답하지 않습니다.

---

## ① Todo API (CRUD)

> 학습 포인트: 가장 기본적인 CRUD API 설계, REST 리소스 모델링, 요청/응답 검증,
> 상태 코드 사용법을 연습합니다.

### `POST /todos` — Todo 생성

**Request Body** (`application/json`, 필수) — `TodoCreateRequest`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `title` | string (minLength 1) | 예 | |
| `description` | string, nullable | 아니오 | |
| `dueDate` | string(date-time), nullable | 아니오 | |

```json
{
  "title": "OpenAPI 명세 작성하기",
  "description": "1주차 명세 초안 작성",
  "dueDate": "2026-08-01T00:00:00Z"
}
```

**응답**

- `201 Created` — 생성된 `Todo`
- `400 Bad Request` (`ErrorResponse`)
- `500 Internal Server Error` (`ErrorResponse`)

### `GET /todos/{todoId}` — Todo 단건 조회

**Path Parameters**: `todoId` (string, uuid, 필수)

**응답**

- `200 OK` — `Todo`
- `404 Not Found` (`ErrorResponse`)
- `500 Internal Server Error` (`ErrorResponse`)

### `PATCH /todos/{todoId}` — Todo 수정 (부분 업데이트)

요청에 포함된 필드만 갱신합니다. 아래 필드는 모두 선택적입니다.

**Path Parameters**: `todoId` (string, uuid, 필수)

**Request Body** (`application/json`, 필수) — `TodoUpdateRequest`

| 필드 | 타입 | 설명 |
|---|---|---|
| `title` | string (minLength 1) | 선택 |
| `description` | string, nullable | 선택 |
| `completed` | boolean | 선택 |
| `dueDate` | string(date-time), nullable | 선택 |

예시 (완료 처리): `{ "completed": true }`

**응답**

- `200 OK` — 수정된 `Todo`
- `400 Bad Request` (`ErrorResponse`)
- `404 Not Found` (`ErrorResponse`)
- `500 Internal Server Error` (`ErrorResponse`)

### `DELETE /todos/{todoId}` — Todo 삭제

**Path Parameters**: `todoId` (string, uuid, 필수)

**응답**

- `204 No Content` — 삭제 성공 (본문 없음)
- `404 Not Found` (`ErrorResponse`)
- `500 Internal Server Error` (`ErrorResponse`)

---

## ② 필터/정렬 조회

> 학습 포인트: 쿼리 파라미터 기반 필터링/정렬, DB WHERE/ORDER BY 절 설계,
> 페이지네이션 없이도 목록 API의 계약을 명확히 하는 법을 연습합니다.

### `GET /todos` — Todo 목록 조회 (필터/정렬 지원)

**Query Parameters**

| 이름 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `completed` | boolean | 아니오 | 완료 여부로 필터링. 생략하면 전체 조회 |
| `sort` | string (`createdAt` \| `dueDate`) | 아니오 | 정렬 기준 필드. 기본값 `createdAt` |
| `order` | string (`asc` \| `desc`) | 아니오 | 정렬 방향. 기본값 `desc`(최신순) |

**응답**

- `200 OK` — Todo 배열 (`Todo[]`)

  ```json
  [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "title": "OpenAPI 명세 작성하기",
      "description": "1주차 명세 초안 작성",
      "completed": false,
      "dueDate": "2026-08-01T00:00:00Z",
      "createdAt": "2026-07-27T10:00:00Z",
      "updatedAt": "2026-07-27T10:00:00Z"
    }
  ]
  ```

- `400 Bad Request` — 잘못된 쿼리 파라미터 (`ErrorResponse`)
- `500 Internal Server Error` (`ErrorResponse`)

---

## ③ 파일 업로드/다운로드

> 학습 포인트: multipart/form-data 파싱, 서버 측 파일 저장, 스트리밍 응답(다운로드),
> 파일 메타데이터 관리를 연습합니다.

### `POST /files` — 이미지 파일 업로드

파일 확장자/MIME 타입 검증 후 디스크(또는 오브젝트 스토리지)에 저장하고,
접근 가능한 식별자를 발급합니다.

**Request Body** (`multipart/form-data`, 필수)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `file` | binary | 예 | 업로드할 이미지 파일 (jpg, jpeg, png, gif, webp) |

**응답**

- `201 Created` — 업로드된 파일 메타데이터 (`FileMeta`)
- `400 Bad Request` — 파일 누락, 허용되지 않는 확장자/MIME 타입, 용량 초과 등 (`ErrorResponse`)
- `500 Internal Server Error` (`ErrorResponse`)

### `GET /files/{fileId}` — 업로드한 파일 다운로드/조회

원본 바이너리를 그대로 스트리밍합니다. `Content-Type`은 업로드 시점의 MIME 타입을
그대로 반환해야 합니다. (`image/png`, `image/jpeg`, `image/gif`, `image/webp`)

**Path Parameters**: `fileId` (string, uuid, 필수)

**응답**

- `200 OK` — 파일 바이너리
- `404 Not Found` (`ErrorResponse`)
- `500 Internal Server Error` (`ErrorResponse`)

### `DELETE /files/{fileId}` — 업로드한 파일 삭제

**Path Parameters**: `fileId` (string, uuid, 필수)

**응답**

- `204 No Content` — 삭제 성공 (본문 없음)
- `404 Not Found` (`ErrorResponse`)
- `500 Internal Server Error` (`ErrorResponse`)

---

## 데이터 모델 (Schemas)

> ①②③에서 공통으로 참조하는 스키마입니다.

### `Todo`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | string(uuid) | 예 | |
| `title` | string | 예 | 예: `"OpenAPI 명세 작성하기"` |
| `description` | string, nullable | 아니오 | |
| `completed` | boolean | 예 | 기본값 `false` |
| `dueDate` | string(date-time), nullable | 아니오 | ISO 8601 UTC |
| `createdAt` | string(date-time) | 예 | ISO 8601 UTC |
| `updatedAt` | string(date-time) | 예 | ISO 8601 UTC |

### `TodoCreateRequest`

| 필드 | 타입 | 필수 |
|---|---|---|
| `title` | string (minLength 1) | 예 |
| `description` | string, nullable | 아니오 |
| `dueDate` | string(date-time), nullable | 아니오 |

### `TodoUpdateRequest`

| 필드 | 타입 | 필수 |
|---|---|---|
| `title` | string (minLength 1) | 아니오 |
| `description` | string, nullable | 아니오 |
| `completed` | boolean | 아니오 |
| `dueDate` | string(date-time), nullable | 아니오 |

### `FileMeta`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | string(uuid) | 예 | |
| `filename` | string | 예 | 예: `"profile.png"` |
| `mimeType` | string | 예 | 예: `"image/png"` |
| `size` | integer | 예 | 바이트 단위 파일 크기 |
| `url` | string | 예 | 다운로드 상대 경로. `GET /files/{fileId}`와 동일 값 |
| `createdAt` | string(date-time) | 예 | |

### `ErrorResponse`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `error` | string | 예 | 예: `"요청한 리소스를 찾을 수 없습니다."` |

---

## 엔드포인트 요약

| 기능 | 메서드 | 경로 | 설명 | 성공 응답 |
|---|---|---|---|---|
| ① CRUD | POST | `/todos` | Todo 생성 | 201 |
| ① CRUD | GET | `/todos/{todoId}` | Todo 단건 조회 | 200 |
| ① CRUD | PATCH | `/todos/{todoId}` | Todo 부분 수정 | 200 |
| ① CRUD | DELETE | `/todos/{todoId}` | Todo 삭제 | 204 |
| ② 필터/정렬 | GET | `/todos` | Todo 목록 조회 (필터/정렬) | 200 |
| ③ 파일 | POST | `/files` | 이미지 파일 업로드 | 201 |
| ③ 파일 | GET | `/files/{fileId}` | 파일 다운로드/조회 | 200 |
| ③ 파일 | DELETE | `/files/{fileId}` | 파일 삭제 | 204 |

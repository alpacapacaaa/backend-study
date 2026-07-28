# backend-template-go-echo

`openapi.yaml` 1주차 명세를 채워나가는 **Go + Echo 스타터 템플릿**입니다.
CORS, 공통 에러 포맷, 프로젝트 골격은 이미 완성되어 있고, `todo.go`와 `file.go`
안의 **TODO만 채우면 됩니다.**

## 요구 사항

- Go 1.21+ (권장: 1.26+)

## 시작하는 법

1. 이 폴더를 통째로 복사해서 `backend-<본인이름>/`으로 이름을 바꾸세요.
   ```bash
   cp -r backend-template-go-echo backend-내이름
   cd backend-내이름
   ```
2. 실행해보세요. **바로 켜집니다** (아무것도 구현 안 해도 됨).
   ```bash
   go run .   # http://localhost:8083
   ```
3. 아무 엔드포인트나 호출해보세요. 아직 구현을 안 했기 때문에 이렇게 나옵니다.
   ```bash
   curl http://localhost:8083/todos
   # {"error":"TODO: GET /todos (필터/정렬) 를 구현하세요."}
   ```
4. `todo.go`, `file.go`를 열어서 TODO 주석을 하나씩 실제 로직으로 바꾸세요.
   채울 때마다 다시 실행해서 curl로 확인하세요.

## 이미 되어 있는 것 / 내가 채워야 하는 것

| 이미 되어 있음 (건드릴 필요 없음) | 내가 채워야 함 |
|---|---|
| `main.go` — CORS, 라우팅 등록, 서버 부트스트랩 | `todo.go`의 각 핸들러 함수 본문 |
| `errors.go` — 공통 에러 포맷(`{ "error": "..." }`) 변환 | `file.go`의 각 핸들러 함수 본문 |
| `Todo`, `FileMeta` 구조체 — 응답 스키마 | |

## 막힐 때 참고할 것

- `openapi.yaml` — 각 엔드포인트의 정확한 요청/응답 형태 (원본)
- `mock-server/src/todos.js`, `mock-server/src/files.js` — 같은 명세를 Node/Express로
  구현한 예시 (로직 흐름 참고용)
- `backend-example/` — Spring Boot로 완성된 답안. 언어는 다르지만 "필터링을 어떤
  순서로 검증하는지" 같은 로직 흐름은 그대로 참고할 수 있습니다.

## 완료 체크리스트

- [ ] `GET /todos` — 필터(`completed`)/정렬(`sort`, `order`) 동작
- [ ] `POST /todos` — 생성, 잘못된 입력 시 400
- [ ] `GET /todos/:id` — 조회, 없으면 404
- [ ] `PATCH /todos/:id` — 부분 수정
- [ ] `DELETE /todos/:id` — 삭제, 없으면 404
- [ ] `POST /files` — 업로드, MIME 타입 검증
- [ ] `GET /files/:id` — 다운로드 (Content-Type 정확히)
- [ ] `DELETE /files/:id` — 삭제
- [ ] `frontend/.env.local`의 `NEXT_PUBLIC_API_URL`을 내 포트로 바꿔서 실제 화면에서 확인
- [ ] `main.go`의 포트를 다른 참여자와 안 겹치는 포트로 변경했는지 확인
- [ ] 이 README를 내 프로젝트에 맞게 실행법/포트/환경변수로 고쳐쓰기

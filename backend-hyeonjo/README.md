# backend-hyeonjo(Go(Echo))
정현조의 백엔드 스터디 레포입니다.

## 실행법
- **Backend**
   1. 실행
      - 방법1. 현 위치에서 `air`을 입력합니다.(라이브코딩용)
      - 방법2. 현 위치에서 `go run .`을 입력합니다.
   2. `localhost:8329`에서 통신할 수 있습니다.
- **Frontend**
   1. `/backend-study/frontend`에서 `npm run dev`를 입력합니다.
   2. `localhost:3000`으로 접속할 수 있습니다.
   - 실행이 되지 않을 경우, frontend 폴더의 `.env.local` 파일을 생성해 다음을 입력합니다.
      `NEXT_PUBLIC_API_URL=http://localhost:8329`

## 완료 체크리스트

- [x] `GET /todos` — 필터(`completed`)/정렬(`sort`, `order`) 동작
- [x] `POST /todos` — 생성, 잘못된 입력 시 400
- [x] `GET /todos/:id` — 조회, 없으면 404
- [x] `PATCH /todos/:id` — 부분 수정
- [x] `DELETE /todos/:id` — 삭제, 없으면 404
- [x] `POST /files` — 업로드, MIME 타입 검증
- [x] `GET /files/:id` — 다운로드 (Content-Type 정확히)
- [x] `DELETE /files/:id` — 삭제
- [x] `frontend/.env.local`의 `NEXT_PUBLIC_API_URL`을 내 포트로 바꿔서 실제 화면에서 확인
- [x] `main.go`의 포트를 다른 참여자와 안 겹치는 포트로 변경했는지 확인
- [x] 이 README를 내 프로젝트에 맞게 실행법/포트/환경변수로 고쳐쓰기

# Frontend

`openapi.yaml` 명세를 기준으로 만든 공통 프론트엔드입니다 (Next.js + TypeScript).
이 폴더는 스터디 참여자 전원이 공유하며, 각자의 백엔드는 API 주소만 바꿔서
그대로 연결합니다.

## 실행 방법

```bash
npm install
npm run dev   # http://localhost:3000
```

## 백엔드 연결하기

`.env.local`의 `NEXT_PUBLIC_API_URL`만 바꾸면 mock 서버든 자신의 백엔드든
그대로 붙습니다. (`.env.example`을 복사해서 시작하세요: `cp .env.example .env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:4000   # mock-server
NEXT_PUBLIC_API_URL=http://localhost:8080   # 예: 본인 Go 백엔드
```

## 구조

- `src/lib/api.ts` — `openapi.yaml`에 대응하는 API 호출 함수 모음 (에러 포맷 공통 처리 포함)
- `src/types/` — `openapi.yaml`의 `components.schemas`와 대응하는 타입
- `src/components/` — 화면 단위 컴포넌트 (Todo 목록/필터/정렬, 파일 업로드)

명세와 프론트 동작이 어긋나면 `openapi.yaml`이 항상 우선입니다. 프론트 코드를
명세에 맞게 고쳐주세요.

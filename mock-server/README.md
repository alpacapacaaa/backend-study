# Mock Server

`openapi.yaml`의 1주차 명세(Todo API, 필터/정렬 조회, 파일 업로드/다운로드)를 그대로 구현한
Express 기반 mock 서버입니다. 실제 백엔드가 준비되기 전에 프론트엔드를 개발/검증하는 용도입니다.

- 데이터는 **인메모리**로 저장됩니다. 서버를 재시작하면 초기화됩니다.
- 업로드된 파일은 `uploads/` 디렉터리에 저장됩니다(`.gitignore` 처리됨).
- CORS는 `http://localhost:3000`만 허용합니다.
- 모든 에러 응답은 `{ "error": "메시지" }` 형태입니다.

## 실행 방법

```bash
cd mock-server
npm install
npm start        # http://localhost:4000
# 코드 변경 시 자동 재시작하려면: npm run dev
```

## 프론트엔드에서 연결하기

`frontend/.env.local`의 `NEXT_PUBLIC_API_URL`을 아래처럼 설정하세요.

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 참고

- 이 mock 서버는 참고용 구현이며 `openapi.yaml`이 원본입니다. 명세와 mock 서버 동작이
  다르다면 명세가 우선이며, mock 서버 쪽 버그로 간주하고 고쳐주세요.
- 각 스터디원의 실제 백엔드는 이 mock 서버를 참고하되, 자기 프레임워크/DB로 새로 구현합니다.

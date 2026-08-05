# 2주차 프론트엔드

회원가입 및 로그인 기능을 위한 프론트엔드입니다.

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 환경변수

`.env.local` 파일 생성:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

백엔드 주소에 맞게 수정하세요.

## 기능

- 회원가입 (`/auth/register`)
- 로그인 (`/auth/login`)
- JWT 토큰 확인 (대시보드)

# 2주차 Mock 서버

2주차 인증 API의 Mock 서버입니다.

## 시작하기

```bash
npm install
npm start
```

서버가 `http://localhost:4000`에서 실행됩니다.

## API 엔드포인트

- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인

## 프론트엔드 연결

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

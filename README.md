# 2주차 - 인증 (회원가입 + 로그인)

2주차 브랜치입니다. 1주차 내용은 포함되지 않습니다.

## 작업 방식

1. **2주차 브랜치에서 풀받기**
   ```bash
   git fetch origin
   git checkout 2주차
   git pull origin 2주차
   ```

2. **각자 자신의 백엔드 폴더 생성**
   ```bash
   cp -r backend-template-go-echo backend-<본인이름>   # Go+Echo
   # 또는
   cp -r backend-template-springboot backend-<본인이름> # Spring Boot
   # 또는
   mkdir backend-<본인이름>                             # 직접 생성
   ```

3. **작업 브랜치 생성**
   ```bash
   git checkout -b <본인이름>-2주차
   ```

4. **구현 후 PR 생성**
   - `2주차` 브랜치로 PR 생성
   - 리뷰 후 머지

## 2주차 기능

### ④ 회원가입 + 비밀번호 해싱
- `POST /auth/register`
- 이메일, 비밀번호, 이름 입력
- 비밀번호는 bcrypt 등으로 해싱하여 저장
- 이메일 중복 검사

### ⑤ 로그인 + JWT 발급
- `POST /auth/login`
- 이메일, 비밀번호로 인증
- JWT 토큰 발급 및 응답

## API 명세

- **상세 명세**: [`2주차api명세.md`](./2주차api명세.md)
- **OpenAPI**: [`openapi.yaml`](./openapi.yaml)
- **Swagger UI**: 
  ```bash
  npx -y swagger-ui-watcher openapi.yaml --port 8001
  ```

## 필수 구현 사항

- [ ] CORS 설정 (`http://localhost:3000` 허용, `Authorization` 헤더 포함)
- [ ] 에러 응답 포맷: `{ "error": "메시지" }`
- [ ] 날짜 포맷: ISO 8601 UTC (`2026-08-05T10:00:00Z`)
- [ ] 비밀번호 해싱 (bcrypt, argon2 등)
- [ ] JWT 토큰 생성 (HS256 또는 RS256)
- [ ] 토큰 만료 시간 설정 (권장: 24시간)

## 포트

각자 다른 포트 사용:
- Go+Echo: `8080`
- Spring Boot: `8081`
- 기타: `8082` 이상

## 프론트엔드 연결

```bash
cd frontend
# .env.local 파일 생성
echo "NEXT_PUBLIC_API_URL=http://localhost:<본인포트>" > .env.local
npm install
npm run dev
```

## 참고 자료

- `backend-template-go-echo/` - Go+Echo 템플릿
- `backend-template-springboot/` - Spring Boot 템플릿
- `mock-server/` - Mock API 서버 (프론트 테스트용)

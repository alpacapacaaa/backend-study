# 2주차 API 명세

## ④ 회원가입 + 비밀번호 해싱

### `POST /auth/register`

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `email` | string(email) | 예 | 이메일 (중복 불가) |
| `password` | string (minLength 8) | 예 | 비밀번호 (8자 이상) |
| `name` | string (minLength 1) | 예 | 사용자 이름 |

**응답**
- `201 Created` — 생성된 사용자 (`UserResponse`)
- `400 Bad Request` — 유효성 검사 실패
- `409 Conflict` — 이미 등록된 이메일
- `500 Internal Server Error`

**중요**
- 비밀번호는 해싱하여 저장 (bcrypt, argon2 등)
- 응답에 비밀번호 포함 금지

---

## ⑤ 로그인 + JWT 발급

### `POST /auth/login`

**Request Body**

| 필드 | 타입 | 필수 |
|---|---|---|
| `email` | string(email) | 예 |
| `password` | string | 예 |

**응답**
- `200 OK` — JWT 토큰 (`AuthResponse`)
- `400 Bad Request` — 유효성 검사 실패
- `401 Unauthorized` — 잘못된 이메일 또는 비밀번호
- `500 Internal Server Error`

---

## 데이터 모델

### `UserResponse`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "홍길동",
  "createdAt": "2026-08-05T10:00:00Z",
  "updatedAt": "2026-08-05T10:00:00Z"
}
```

### `AuthResponse`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { /* UserResponse */ }
}
```

### `ErrorResponse`
```json
{
  "error": "에러 메시지"
}
```

---

## 구현 체크리스트

- [ ] 비밀번호 해싱 (bcrypt 등)
- [ ] 이메일 중복 검사
- [ ] JWT 토큰 생성 (HS256/RS256)
- [ ] 토큰 만료 시간 설정
- [ ] CORS: `Authorization` 헤더 허용
- [ ] 에러 포맷: `{ "error": "메시지" }`
- [ ] 날짜 포맷: ISO 8601 UTC

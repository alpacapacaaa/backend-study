# 2주차 API 명세 (텍스트 버전)

> 이 문서는 [`openapi.yaml`](./openapi.yaml)의 2주차 범위를 사람이 읽기 편한
> 텍스트 형식으로 다시 정리한 것입니다. **원본은 항상
> `openapi.yaml`이며**, 이 문서는 참고용 요약본입니다. 둘이 어긋나면
> `openapi.yaml`을 따르세요.

2주차 기능: ④ 회원가입 + 비밀번호 해싱 ⑤ 로그인 + JWT 발급

- 버전: 2.0.0
- 예시 서버: `http://localhost:8080`(Go+Echo), `http://localhost:8081`(Spring Boot),
  `http://localhost:8082`(그 외, 본인 포트로 자유롭게 변경 가능)
- 실제 접속 주소는 프론트엔드의 `NEXT_PUBLIC_API_URL` 환경변수로 지정합니다.

## 공통 규칙 (모든 엔드포인트 필수 준수)

### CORS

모든 백엔드 구현체는 반드시 프론트엔드 origin(`http://localhost:3000`)을 CORS로 허용해야 합니다.

- `Access-Control-Allow-Origin: http://localhost:3000`
- `Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`
- 2주차부터 인증 기능이 추가되므로 `Authorization` 헤더 허용이 반드시 필요합니다.

### 에러 응답 포맷

성공/실패와 무관하게 에러가 발생하면 항상 아래 형태의 JSON 하나로만 응답합니다.

```json
{ "error": "사람이 읽을 수 있는 에러 메시지" }
```

- HTTP 상태 코드로 에러 종류(400/401/403/404/409/500 등)를 구분합니다.
- 바디의 형태 자체는 절대 바꾸지 않습니다. (`errors` 배열, `message` 필드 등 금지)

### 날짜/시간 포맷

모든 날짜/시간 값은 ISO 8601, UTC(`Z`) 형식의 문자열로 표현합니다.

- 예: `2026-08-05T10:00:00Z`
- 타임존을 생략하거나 로컬 시간으로 응답하지 않습니다.

---

## ④ 회원가입 + 비밀번호 해싱

> 학습 포인트: 사용자 등록, 비밀번호 보안 저장(해싱), 중복 검사, 입력 검증을 연습합니다.

### `POST /auth/register` — 회원가입

새로운 사용자를 등록합니다. 비밀번호는 반드시 해싱하여 저장해야 합니다.

**Request Body** (`application/json`, 필수) — `RegisterRequest`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `email` | string(email) | 예 | 이메일 주소 (중복 불가) |
| `password` | string (minLength 8) | 예 | 비밀번호 (8자 이상) |
| `name` | string (minLength 1) | 예 | 사용자 이름 |

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "홍길동"
}
```

**응답**

- `201 Created` — 생성된 사용자 정보 (`UserResponse`)
- `400 Bad Request` — 유효성 검사 실패 (이메일 형식 오류, 비밀번호 길이 부족 등) (`ErrorResponse`)
- `409 Conflict` — 이미 등록된 이메일 (`ErrorResponse`)
- `500 Internal Server Error` (`ErrorResponse`)

**중요 사항**

- 비밀번호는 절대 평문으로 저장하지 않습니다. bcrypt, argon2 등의 해시 알고리즘을 사용하세요.
- 응답에 비밀번호 해시를 포함하지 않습니다.
- 이메일은 중복될 수 없습니다.

---

## ⑤ 로그인 + JWT 발급

> 학습 포인트: 인증 토큰 기반 인증, JWT 생성/검증, 토큰 기반 세션 관리를 연습합니다.

### `POST /auth/login` — 로그인

이메일과 비밀번호를 검증하고 JWT 액세스 토큰을 발급합니다.

**Request Body** (`application/json`, 필수) — `LoginRequest`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `email` | string(email) | 예 | 이메일 주소 |
| `password` | string | 예 | 비밀번호 |

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**응답**

- `200 OK` — JWT 토큰 (`AuthResponse`)
- `400 Bad Request` — 유효성 검사 실패 (`ErrorResponse`)
- `401 Unauthorized` — 잘못된 이메일 또는 비밀번호 (`ErrorResponse`)
- `500 Internal Server Error` (`ErrorResponse`)

**중요 사항**

- JWT 토큰은 응답 바디의 `token` 필드에 포함됩니다.
- 토큰 만료 시간은 일반적으로 1시간~24시간으로 설정합니다.
- 클라이언트는 이 토큰을 `Authorization: Bearer <token>` 헤더로 사용합니다.

---

## 인증 토큰 사용법 (참고)

2주차에서 발급받은 JWT 토큰은 3주차 이후 인증이 필요한 엔드포인트에서 사용됩니다.

**토큰 포함 방식:**

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**참고:** 2주차에서는 인증 미들웨어(⑥)가 제외되었으므로, 실제 인증 검증은 3주차부터 구현합니다.
2주차는 토큰 발급까지만 진행합니다.

---

## 데이터 모델 (Schemas)

> ④⑤에서 공통으로 참조하는 스키마입니다.

### `User`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | string(uuid) | 예 | |
| `email` | string(email) | 예 | |
| `name` | string | 예 | |
| `createdAt` | string(date-time) | 예 | ISO 8601 UTC |
| `updatedAt` | string(date-time) | 예 | ISO 8601 UTC |

**참고:** 비밀번호는 응답에 포함되지 않습니다.

### `RegisterRequest`

| 필드 | 타입 | 필수 |
|---|---|---|
| `email` | string(email) | 예 |
| `password` | string (minLength 8) | 예 |
| `name` | string (minLength 1) | 예 |

### `LoginRequest`

| 필드 | 타입 | 필수 |
|---|---|---|
| `email` | string(email) | 예 |
| `password` | string | 예 |

### `UserResponse`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | string(uuid) | 예 | |
| `email` | string(email) | 예 | |
| `name` | string | 예 | |
| `createdAt` | string(date-time) | 예 | |
| `updatedAt` | string(date-time) | 예 | |

### `AuthResponse`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `token` | string | 예 | JWT 액세스 토큰 |
| `user` | UserResponse | 예 | 사용자 정보 |

### `ErrorResponse`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `error` | string | 예 | 예: `"이미 등록된 이메일입니다."` |

---

## 엔드포인트 요약

| 기능 | 메서드 | 경로 | 설명 | 성공 응답 |
|---|---|---|---|---|
| ④ 회원가입 | POST | `/auth/register` | 사용자 등록 | 201 |
| ⑤ 로그인 | POST | `/auth/login` | JWT 토큰 발급 | 200 |

---

## 구현 체크리스트

- [ ] **비밀번호 해싱**: bcrypt, argon2 등 보안 해시 알고리즘 사용
- [ ] **이메일 중복 검사**: 회원가입 시 이미 등록된 이메일인지 확인
- [ ] **JWT 토큰 생성**: HS256 또는 RS256 알고리즘 사용
- [ ] **토큰 만료 시간**: 적절한 만료 시간 설정 (예: 24시간)
- [ ] **에러 처리**: 400(유효성), 401(인증 실패), 409(중복) 상태 코드 정확히 반환
- [ ] **CORS**: `Authorization` 헤더 허용

# Backend Study

백엔드 스터디 저장소입니다. 각 주차별 브랜치에서 작업합니다.

## 브랜치 구조

| 브랜치 | 주제 | 내용 |
|--------|------|------|
| `main` | - | 공통 파일만 포함 |
| `1주차` | 기본기 | Todo CRUD, 필터/정렬, 파일 업로드 |
| `2주차` | 인증 | 회원가입, 로그인, JWT |
| `3주차` | DB 심화 | 관계형 모델링, 트랜잭션, 캐싱 |
| `4주차` | 비동기/실시간 | 백그라운드 큐, WebSocket, 스케줄링 |
| `5주차` | 품질/운영 | 테스트, 로깅, Docker, CI/CD |

## 작업 방식

1. **해당 주차 브랜치로 이동**
   ```bash
   git fetch origin
   git checkout <N>주차
   git pull origin <N>주차
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
   git checkout -b <본인이름>-<N>주차
   ```

4. **구현 후 PR 생성**
   - `<N>주차` 브랜치로 PR 생성
   - 리뷰 후 머지

## 공통 규칙

### CORS
- `Access-Control-Allow-Origin: http://localhost:3000`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

### 에러 응답 포맷
```json
{ "error": "에러 메시지" }
```

### 날짜/시간 포맷
- ISO 8601, UTC: `2026-08-05T10:00:00Z`

## 포트 가이드라인

각자 다른 포트 사용:
- Go+Echo: `8080`
- Spring Boot: `8081`
- 기타: `8082` 이상

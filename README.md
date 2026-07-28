# Study with me(Backend)

프론트엔드와 API 명세는 공통으로 사용하고, 각자 자신이 원하는 백엔드
프레임워크(Go+Echo, Spring Boot, NestJS, Django 등 무엇이든)로 같은 명세를
구현해서 같은 프론트에 붙여보는 스터디입니다.

5주 동안 주당 3개씩, 총 15개 기능을 난이도 순(A→Z)으로 쌓습니다. 매주 새 기능이
추가되면 `openapi.yaml`, `mock-server/`, `frontend/`도 그 주차 범위만큼 함께
갱신됩니다.

claude code, codex 같은 코딩 에이전트는 절대 사용하지 않고
막히는 부분이 있다면 IDE 밖에서 독립된 AI를 사용하기를 추천합니다.

backend-example 폴더에 예시를 구현해놨으니 참고해도 좋습니다!
프로젝트 시작 전까지 본인이 맡은 언어로 백엔드를 맡았을 때 1인분을 할 수 있게끔 하는것이 목표입니다.

## 저장소 구조

```
project-root/
├── frontend/                      # 공통 프론트엔드 (Next.js + TypeScript)
├── openapi.yaml                   # API 명세 (매주 갱신됨)
├── mock-server/                   # 명세 기반 mock 서버 (백엔드 없이 프론트 검증용)
├── backend-example/               # 완성된 예시 백엔드 (Spring Boot, 참고용)
├── backend-template-springboot/   # Spring Boot TODO 스타터 (복사해서 바로 시작)
├── backend-template-go-echo/      # Go+Echo TODO 스타터 (복사해서 바로 시작)
├── backend-<본인이름>/            # 각자 새로 만드는 자신의 백엔드 구현
├── docs/                          # 설치/환경별 보조 가이드 (Windows+VS Code 등)
└── README.md
```

## 5주 로드맵

| 주차 | 주제 | 기능 |
|---|---|---|
| 1주차 | 기본기 | ① Todo API (CRUD) ② 필터/정렬 조회 ③ 파일 업로드/다운로드 |
| 2주차 | 인증 | ④ 회원가입 + 비밀번호 해싱 ⑤ 로그인 + JWT 발급 ⑥ 인증 미들웨어 |
| 3주차 | DB 심화 | ⑦ 관계형 모델링(1:N, N:M) + JOIN + 인덱스 ⑧ 트랜잭션 ⑨ 캐싱(Redis) |
| 4주차 | 비동기/실시간 | ⑩ 백그라운드 작업 큐 ⑪ WebSocket ⑫ 스케줄링(Cron) |
| 5주차 | 품질/운영 | ⑬ 테스트 코드 ⑭ 로깅/모니터링 ⑮ Docker + CI/CD |

각 기능이 어떤 백엔드 개념을 연습하기 위한 것인지는 `openapi.yaml`의 태그/설명과
각 주차 섹션에 한 줄 요약으로 남겨둡니다.

**현재 진행 상태: 1주차 완료** (`openapi.yaml`, `mock-server/`, `frontend/` 모두
1주차 범위까지 구현되어 있습니다.)

## 시작하기 (참여자용)

1. 저장소를 클론합니다.
2. 루트에 자신의 이름으로 백엔드 폴더를 새로 만듭니다.

   **Spring Boot나 Go+Echo를 쓴다면** 아래처럼 준비된 템플릿을 복사해서
   시작하는 걸 추천합니다. CORS/공통 에러 포맷/프로젝트 골격이 이미 되어
   있고, 각 엔드포인트가 TODO로 비워져 있어서(호출하면 501과 함께 무엇을
   구현해야 하는지 알려줌) 바로 로직부터 채워나갈 수 있습니다.
   ```bash
   cp -r backend-template-springboot backend-<본인이름>   # Spring Boot
   # 또는
   cp -r backend-template-go-echo backend-<본인이름>       # Go + Echo
   cd backend-<본인이름>
   ```
   **다른 언어/프레임워크를 쓴다면** 그냥 빈 폴더를 새로 만들어서 자유롭게 시작하면 됩니다.
   ```bash
   mkdir backend-<본인이름>
   cd backend-<본인이름>
   ```
3. `openapi.yaml`을 읽고, 그 안의 엔드포인트를 하나씩 구현합니다.
   - 템플릿을 썼다면 각 파일의 TODO 주석을 따라가면 됩니다.
   - 막막하면 `mock-server/`가 같은 명세를 어떻게 구현했는지, `backend-example/`이
     Spring Boot로 어떻게 완성했는지 참고하세요 (참고용일 뿐, `openapi.yaml`이 항상 원본입니다).
4. 서버가 뜨면 `frontend/.env.local`의 `NEXT_PUBLIC_API_URL`을 자신의 백엔드
   주소로 바꿔서 실제로 연결해봅니다.
5. 자신의 폴더(`backend-<본인이름>/README.md`)에 실행 방법을 남깁니다.
   - 설치 방법 (예: `go mod download`, `./gradlew build` 등)
   - 필요한 환경변수 목록과 예시 값
   - 실행 명령어와 기본 포트


## Swagger UI로 명세 보면서 확인하기

`openapi.yaml`을 브라우저에서 보기 좋게 렌더링해서, 각 엔드포인트를 펼쳐 값을 입력하고
바로 실제 요청까지 날려볼 수 있는 도구입니다. TODO를 하나씩 채울 때마다 이걸로 확인하면
curl보다 눈으로 보기 편합니다.

### 1. 실행하기

**꼭 `openapi.yaml`이 있는 프로젝트 루트에서** 실행하세요 (백엔드 폴더 안에서 실행하면
파일을 못 찾습니다).

```bash
cd backend-study   # openapi.yaml이 있는 최상위 폴더
npx -y swagger-ui-watcher openapi.yaml --port 8001 --host localhost
```

터미널에
`Listening on http://localhost:8001`이 뜨면 성공, 브라우저에서 그 주소로 접속하세요.
`openapi.yaml`이 바뀌면 자동으로 새로고침되니 계속 켜둬도 됩니다.

### 2. 내 백엔드 포트로 연결하기

화면 상단 "Servers" 드롭다운에서 `http://localhost:{port}` 항목을 선택하면, 바로 아래
`port` 입력창이 나타납니다. 여기에 본인 백엔드가 실행 중인 포트(템플릿 기본값 `8083`,
바꿨다면 그 값)를 입력하세요.

### 3. TODO 채우고 → Swagger UI에서 확인, 반복

1-1(Go). `todo.go`/`file.go`에서 TODO 하나를 실제 로직으로 채움
1-2(Spring). `TodoController.java`/`FileController.java`에서 TODO 하나를 실제 로직으로 채움
2-1(Go). 서버 재시작 (`Ctrl+C` → `go run .`) 
2-2(Spring). 서버 재시작 (`Ctrl+C` → `./mvnw spring-boot:run`)
3. Swagger UI에서 방금 구현한 엔드포인트를 펼치고 "Try it out" → 값 입력 → "Execute"
4. 상태 코드/응답 바디가 명세대로 나오는지 확인
5. 다음 TODO로 이동, 반복

### mock 서버로 프론트 먼저 확인해보기

아직 자신의 백엔드가 없어도 프론트 동작을 먼저 볼 수 있습니다.

```bash
# 터미널 1
cd mock-server && npm install && npm start   # http://localhost:4000

# 터미널 2
cd frontend && npm install && npm run dev    # http://localhost:3000
```

## 명세(`openapi.yaml`) 준수 규칙

- `openapi.yaml`은 **변경 금지**입니다. 프론트는
  이 명세만 믿고 어떤 백엔드와도 연결될 수 있어야 합니다.
- 명세가 애매하거나 빠진 부분이 있으면 **임의로 해석해서 구현하지 말고**,
  작성자에게 말씀해주시면 감사하겠습니다. (명세 변경 → 구현 순서를 반드시 지킬 것)
- 각자의 백엔드는 **반드시 서로 다른 포트**를 사용합니다. (`openapi.yaml`의
  `servers` 목록에 자신의 포트를 예시로 추가해도 좋습니다.)

## 명세에서 특히 자주 어긋나는 부분 (체크리스트)

구현 전/후로 꼭 확인하세요. 이 네 가지는 실제로 프론트-백엔드 연결에서
가장 흔하게 문제가 되는 지점입니다.

- [ ] **CORS**: `http://localhost:3000` origin을 허용했는가? (`Access-Control-Allow-Origin`,
      필요한 메서드/헤더 포함, `OPTIONS` preflight 응답까지 확인)
- [ ] **에러 응답 포맷**: 모든 에러가 예외 없이 `{ "error": "메시지" }` 형태인가?
      (스택트레이스, `"errors"` 배열, `"message"` 필드 등 다른 형태 금지)
- [ ] **날짜/시간 포맷**: 모든 날짜가 ISO 8601 UTC(`2026-07-27T10:00:00Z`)로
      나가는가? (타임존 누락, 로컬 시간, epoch 숫자 등 금지)
- [ ] **HTTP 상태 코드**: 성공(200/201/204)과 실패(400/401/403/404/409/500)를
      명세대로 구분해서 반환하는가?

## 참고 자료

- `backend-template-springboot/`, `backend-template-go-echo/` — TODO만 채우면 되는
  스타터 템플릿. 각 폴더 README에 시작하는 법이 적혀 있습니다.
- `backend-example/` — Spring Boot로 완성된 예시. 정말 막힐 때만 참고하세요.
- `docs/` — OS/IDE 조합별 설치·환경설정 가이드 (예: Windows + VS Code).

# backend-example (Spring Boot)

`openapi.yaml` 1주차 명세(Todo API, 필터/정렬 조회, 파일 업로드/다운로드)를 그대로 구현한
**참고용** Spring Boot 백엔드입니다. 스터디원 각자의 실제 구현(`backend-<이름>/`)과는
별개이며, 명세를 어떻게 구현하면 되는지 막막할 때 참고하는 용도입니다.

## 특징 / 설계 선택

코드를 최대한 단순하게 유지하기 위해 아래처럼 구성했습니다.

- **DB 없음** — `mock-server/`와 마찬가지로 데이터(Todo, 업로드 파일)를 전부
  인메모리(`ConcurrentHashMap`)에 저장합니다. 서버를 재시작하면 초기화됩니다.
  (관계형 DB 연동은 3주차 주제라 지금은 다루지 않습니다.)
- **레이어 최소화** — Service/Repository 계층을 따로 두지 않고 컨트롤러 안에서
  바로 처리합니다. 파일 하나당 책임 하나(Todo용 컨트롤러, 파일용 컨트롤러,
  에러 처리, CORS 설정)만 지도록만 나눴습니다.
- **공통 에러 처리** — `@RestControllerAdvice`(`GlobalExceptionHandler`)에서
  모든 예외를 `{ "error": "메시지" }` 형태로 변환합니다.

## 요구 사항

- Java 21+
- Maven은 설치 안 되어 있어도 됩니다 (`./mvnw`가 자동으로 받아옵니다)

## 실행 방법

```bash
cd backend-example
./mvnw spring-boot:run   # http://localhost:8081
```

## 환경변수 / 설정

`src/main/resources/application.properties`에서 관리합니다.

| 설정 | 기본값 | 설명 |
|---|---|---|
| `server.port` | `8081` | `openapi.yaml`의 `servers` 목록에 등록된 Spring Boot 예시 포트 |
| `spring.servlet.multipart.max-file-size` | `10MB` | 파일 업로드 최대 용량 |

## 프론트엔드에서 연결하기

`frontend/.env.local`의 `NEXT_PUBLIC_API_URL`을 아래처럼 설정하세요.

```
NEXT_PUBLIC_API_URL=http://localhost:8081
```

## 구조

```
src/main/java/com/backendstudy/example/
├── BackendExampleApplication.java   # 부트스트랩
├── WebConfig.java                   # CORS 설정
├── Todo.java                        # openapi.yaml Todo 스키마
├── TodoController.java              # /todos 전체 (CRUD + 필터/정렬)
├── FileController.java              # /files 전체 (업로드/다운로드/삭제)
├── ApiException.java                # 상태코드 + 메시지를 담는 커스텀 예외
├── ErrorResponse.java               # { "error": "..." } 응답 바디
└── GlobalExceptionHandler.java      # 모든 예외 → 공통 에러 포맷 변환
```

## 참고

- 이 구현은 참고용일 뿐이며 `openapi.yaml`이 항상 원본입니다. 명세와 다르게
  동작한다면 이 코드 쪽 버그로 간주하고 고쳐주세요.
- 직접 백엔드를 구현하는 스터디원은 이 폴더를 그대로 베끼기보다, 막히는
  부분만 참고하는 걸 권장합니다.

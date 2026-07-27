# Windows + VS Code로 Spring Boot 백엔드 시작하기

`backend-<본인이름>/` 폴더에서 Spring Boot로 백엔드를 만들 때, **Windows + VS Code** 조합으로
처음부터 1주차 완성까지 진행하는 순서를 정리한 가이드입니다. macOS나 IntelliJ를 쓰는
경우에도 흐름은 같고 일부 명령어/설치 방법만 다릅니다.

## 0. 미리 설치할 것

| 도구 | 용도 | 설치 방법 (Windows) |
|---|---|---|
| Git | 저장소 클론 | https://git-scm.com/download/win 또는 `winget install Git.Git` |
| Java 21+ (JDK) | Spring Boot 실행 | `winget install EclipseAdoptium.Temurin.21.JDK` 또는 https://adoptium.net 에서 설치파일 다운로드 |
| VS Code | 코드 에디터 | https://code.visualstudio.com |
| VS Code 확장: **Extension Pack for Java** (Microsoft) | Java 언어 지원, 디버거, Maven 연동 | VS Code 확장 탭에서 검색 후 설치 |
| VS Code 확장: **Spring Boot Extension Pack** (VMware) | Spring Initializr 연동, 실행 대시보드 | VS Code 확장 탭에서 검색 후 설치 |

설치 확인 (PowerShell 또는 cmd에서):

```powershell
git --version
java -version
```

`java -version`이 21 이상으로 안 나오면 JDK가 제대로 안 잡힌 것이니, VS Code를 재시작하거나
환경변수 `JAVA_HOME`을 확인하세요.

## 1. 저장소 클론

```powershell
git clone <저장소-주소>
cd project-root
```

## 2. 코드 짜기 전에 명세부터 읽기

- **`openapi.yaml`** — 1주차 범위(Todo CRUD, 필터/정렬 조회, 파일 업로드/다운로드)의
  엔드포인트, 요청/응답 스키마 확인
- **`README.md`** — CORS 허용 / 에러 응답 포맷(`{ "error": "메시지" }`) / 날짜 형식
  (ISO 8601, `2026-07-27T10:00:00Z`) 체크리스트 확인. 실제로 가장 많이 어긋나는 부분입니다.

## 3. 템플릿 복사해서 내 폴더 만들기

`backend-template-springboot/`는 CORS, 공통 에러 포맷, 프로젝트 골격이 이미 완성되어
있고 각 엔드포인트가 TODO로 비워져 있는 스타터입니다. 이걸 복사해서 시작하면
"프로젝트 뼈대 만들기" 과정 전체를 건너뛸 수 있습니다.

```powershell
xcopy /E /I backend-template-springboot backend-내이름
cd backend-내이름
code .
```

(탐색기에서 `backend-template-springboot` 폴더를 복사 → 붙여넣기 → 이름을
`backend-내이름`으로 바꿔도 동일합니다.)

> 완전히 처음부터 직접 만들어보고 싶다면 템플릿 없이 `start.spring.io`나 VS Code의
> **"Spring Initializr: Create a Maven Project"** 명령으로 새로 생성해도 됩니다.
> 다만 그 경우 CORS/에러 포맷 처리를 직접 추가해야 합니다.

## 4. 켜지는지부터 확인 (바로 켜집니다)

1. VS Code 우측 하단에 뜨는 Java 의존성 다운로드 진행 알림이 끝날 때까지 대기
2. `src/main/java/.../BackendTemplateApplication.java` 파일 열기
3. `public static void main(...)` 줄 위에 뜨는 **Run** 코드렌즈 클릭
   (또는 왼쪽 사이드바 **Spring Boot Dashboard**에서 앱 이름 옆 ▶ 클릭)
4. 하단 터미널에 `Tomcat started on port 8080` 같은 로그가 뜨면 성공
5. PowerShell에서 확인:
   ```powershell
   curl.exe http://localhost:8080/todos
   # {"error":"TODO: GET /todos (필터/정렬) 를 구현하세요."} 가 뜨면 정상입니다.
   #   (아직 아무 것도 구현 안 했다는 뜻이지, 에러가 아니에요)
   ```

터미널에서 직접 실행하고 싶으면:

```powershell
mvnw.cmd spring-boot:run
```

## 5. 포트만 내 것으로 바꾸기

`src/main/resources/application.properties`:

```properties
server.port=8082
```

> 포트는 `openapi.yaml`의 `servers` 목록을 참고해서 다른 참여자와 겹치지 않게 정하세요.
> CORS는 `WebConfig.java`에 이미 설정되어 있어서 안 건드려도 됩니다.

## 6. TODO를 하나씩 채워서 구현

`TodoController.java`, `FileController.java`를 열면 메서드마다 TODO 주석과 함께
`throw ApiException.todo("...")`가 있습니다. 위에서부터 순서대로, **하나 채울 때마다
바로 재실행해서 curl로 확인**하세요.

1. `GET /todos` (필터/정렬)
2. `POST /todos`
3. `GET /todos/{id}`, `PATCH /todos/{id}`, `DELETE /todos/{id}`
4. `POST /files` (업로드), `GET /files/{id}` (다운로드), `DELETE /files/{id}`

막히면 `backend-example/`(완성된 Spring Boot 답안)의 같은 파일을 열어 구조만
참고하세요. 그대로 베끼기보다 "이런 식으로 처리하는구나" 정도로 보는 걸 추천합니다.

## 7. 테스트하기 — Windows 셸별 주의사항

Windows에서는 셸에 따라 `curl` 동작이 달라서 헷갈리기 쉽습니다.

- **PowerShell**: 기본 `curl`이 사실 `Invoke-WebRequest`에 연결되어 있어 진짜 curl과 문법이
  다릅니다. 진짜 curl을 쓰려면 `curl.exe`로 명시하세요.
- **cmd.exe**: 진짜 curl이지만, bash와 큰따옴표 이스케이프 방식이 다릅니다.

```powershell
# PowerShell 예시
curl.exe http://localhost:8082/todos
curl.exe -X POST http://localhost:8082/todos -H "Content-Type: application/json" -d '{\"title\":\"테스트\"}'
```

명령어 이스케이프가 번거로우면 **Postman** 같은 GUI 툴을 쓰는 걸 추천합니다 — Windows에서
훨씬 편합니다.

확인할 것:

- [ ] 응답이 `openapi.yaml` 스키마와 일치하는가
- [ ] 에러 응답이 `{ "error": "메시지" }` 형태인가
- [ ] 날짜가 `2026-07-27T10:00:00Z` 형태(ISO 8601, UTC)인가

## 8. 프론트엔드와 연결해서 최종 확인

`frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8082
```

```powershell
cd frontend
npm install
npm run dev   # http://localhost:3000
```

브라우저에서 Todo 생성/체크/삭제, 필터/정렬, 이미지 업로드까지 직접 눌러보면서 확인하면
1주차 완성입니다.

## 9. 마무리

`backend-내이름/README.md`에 아래 내용을 남겨두세요.

- 설치 방법 (JDK 버전 등)
- 환경변수/설정 값 (포트 번호 등)
- 실행 명령어 (`mvnw.cmd spring-boot:run`)

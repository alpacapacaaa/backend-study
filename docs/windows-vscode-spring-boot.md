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

## 3. 내 백엔드 폴더 만들기

```powershell
mkdir backend-내이름
cd backend-내이름
code .
```

## 4. Spring Boot 프로젝트 뼈대 생성 (VS Code 안에서)

1. `Ctrl+Shift+P` → **"Spring Initializr: Create a Maven Project"** 검색 후 실행
2. 순서대로 선택:
   - Language: **Java**
   - Spring Boot 버전: 안정 버전(SNAPSHOT 아닌 것) 중 최신
   - groupId / artifactId: 자유롭게 (예: `com.study` / `backend-내이름`)
   - Java 버전: **21**
   - Dependencies: **Spring Web** 추가하고 완료
3. 저장 위치를 `backend-내이름` 폴더로 지정
4. 생성 완료 후 "새 창에서 열지" 물어보면 **Open**

## 5. 뼈대가 켜지는지부터 확인

1. `src/main/java/.../XxxApplication.java` 파일 열기
2. `public static void main(...)` 줄 위에 뜨는 **Run** 코드렌즈 클릭
   (또는 왼쪽 사이드바 **Spring Boot Dashboard**에서 앱 이름 옆 ▶ 클릭)
3. 하단 터미널에 `Tomcat started on port 8080` 같은 로그가 뜨면 성공
4. 브라우저로 `http://localhost:8080` 접속 → 아직 라우트를 안 만들었으니 에러 페이지가
   떠도 정상입니다. **"서버 프로세스가 켜졌다"**는 것만 확인하는 단계예요.

터미널에서 직접 실행하고 싶으면:

```powershell
mvnw.cmd spring-boot:run
```

## 6. 기본 설정: 포트 + CORS

`src/main/resources/application.properties`:

```properties
server.port=8082
```

> 포트는 `openapi.yaml`의 `servers` 목록을 참고해서 다른 참여자와 겹치지 않게 정하세요.

CORS 허용 설정도 필요합니다 (프론트가 `http://localhost:3000`에서 요청을 보내므로).
`backend-example/src/main/java/.../WebConfig.java`를 열어 구조를 참고해서 비슷하게
클래스를 하나 추가하세요.

## 7. 엔드포인트를 하나씩 구현

한 번에 다 만들려 하지 말고 아래 순서로, **하나 만들 때마다 바로 실행해서 확인**하세요.

1. `GET /todos` — 우선 빈 배열이라도 반환 (라우팅이 제대로 연결됐는지 확인용)
2. `POST /todos`
3. `GET /todos/{id}`, `PATCH /todos/{id}`, `DELETE /todos/{id}`
4. 필터(`completed`) / 정렬(`sort`, `order`) 쿼리 파라미터 처리
5. 파일 업로드/다운로드 (`/files`)

막히면 `backend-example/`(참고용 Spring Boot 구현)의 `TodoController.java`,
`FileController.java`를 열어 구조만 참고하세요. 그대로 베끼기보다 "이런 식으로
처리하는구나" 정도로 보는 걸 추천합니다.

## 8. 테스트하기 — Windows 셸별 주의사항

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

## 9. 프론트엔드와 연결해서 최종 확인

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

## 10. 마무리

`backend-내이름/README.md`에 아래 내용을 남겨두세요.

- 설치 방법 (JDK 버전 등)
- 환경변수/설정 값 (포트 번호 등)
- 실행 명령어 (`mvnw.cmd spring-boot:run`)

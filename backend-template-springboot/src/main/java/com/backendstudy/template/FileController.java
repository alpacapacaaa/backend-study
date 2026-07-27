package com.backendstudy.template;

import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

// openapi.yaml 의 /files 관련 엔드포인트를 구현하는 곳입니다.
// 아래 TODO를 하나씩 채워나가세요. 채우기 전까지는 501(Not Implemented)이 반환됩니다.
//
// 참고할 것:
//   - openapi.yaml 의 /files, /files/{fileId} 경로 정의
//   - mock-server/src/files.js (같은 명세를 Node/Express로 구현한 예시)
//   - backend-example/ (막막할 때만 참고하는 완성본)
@RestController
@RequestMapping("/files")
public class FileController {

    // openapi.yaml이 허용하는 이미지 MIME 타입
    private static final Set<String> ALLOWED_MIME_TYPES =
            Set.of("image/png", "image/jpeg", "image/gif", "image/webp");

    // 업로드된 파일의 메타데이터 + 바이너리를 함께 담아둘 저장소용 record.
    // 그대로 써도 되고, 필요하면 구조를 바꿔도 됩니다.
    private record StoredFile(String id, String filename, String mimeType, byte[] data, Instant createdAt) {}

    // openapi.yaml의 FileMeta 스키마와 대응하는 응답 모양.
    public record FileMeta(String id, String filename, String mimeType, long size, String url, Instant createdAt) {}

    // 인메모리 저장소. (서버 재시작하면 초기화됨)
    private final Map<String, StoredFile> files = new ConcurrentHashMap<>();

    @PostMapping
    public FileMeta upload(@RequestParam("file") MultipartFile file) {
        // TODO 1: file이 비어있으면 400을 던지세요.
        // TODO 2: file.getContentType()이 ALLOWED_MIME_TYPES에 없으면 400을 던지세요.
        // TODO 3: id를 발급하고 files에 저장한 뒤, FileMeta를 201 Created로 반환하세요.
        //         (Spring에서는 @ResponseStatus(HttpStatus.CREATED) 사용)
        throw ApiException.todo("POST /files (업로드)");
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> download(@PathVariable String id) {
        // TODO: id로 저장된 파일을 찾아서 반환하세요 (없으면 404).
        //       Content-Type 헤더를 업로드 당시 mimeType으로 설정해야 합니다.
        throw ApiException.todo("GET /files/{id} (다운로드)");
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        // TODO: id로 찾아서 삭제하고, 없으면 404를 던지세요.
        //       성공 시 204 No Content로 응답하세요.
        throw ApiException.todo("DELETE /files/{id} (삭제)");
    }
}

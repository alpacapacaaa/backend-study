package com.backendstudy.example;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/files")
public class FileController {

    private static final Set<String> ALLOWED_MIME_TYPES =
            Set.of("image/png", "image/jpeg", "image/gif", "image/webp");

    private record StoredFile(String id, String filename, String mimeType, byte[] data, Instant createdAt) {}

    public record FileMeta(String id, String filename, String mimeType, long size, String url, Instant createdAt) {}

    // 메타데이터 + 바이너리를 모두 인메모리로 저장합니다. 서버를 재시작하면 초기화됩니다.
    private final Map<String, StoredFile> files = new ConcurrentHashMap<>();

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FileMeta upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "file 필드가 필요합니다.");
        }

        String mimeType = file.getContentType();
        if (mimeType == null || !ALLOWED_MIME_TYPES.contains(mimeType)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "지원하지 않는 파일 형식입니다. (jpg, jpeg, png, gif, webp만 허용)");
        }

        byte[] data;
        try {
            data = file.getBytes();
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "파일을 읽는 중 오류가 발생했습니다.");
        }

        String id = UUID.randomUUID().toString();
        StoredFile stored = new StoredFile(
                id, file.getOriginalFilename(), mimeType, data, Instant.now().truncatedTo(ChronoUnit.SECONDS));
        files.put(id, stored);

        return new FileMeta(id, stored.filename(), stored.mimeType(), data.length, "/files/" + id, stored.createdAt());
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> download(@PathVariable String id) {
        StoredFile stored = findOrThrow(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(stored.mimeType()))
                .body(stored.data());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        findOrThrow(id);
        files.remove(id);
    }

    private StoredFile findOrThrow(String id) {
        StoredFile stored = files.get(id);
        if (stored == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "해당 id의 파일을 찾을 수 없습니다.");
        }
        return stored;
    }
}

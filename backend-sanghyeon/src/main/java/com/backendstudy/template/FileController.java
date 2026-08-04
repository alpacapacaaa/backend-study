package com.backendstudy.template;

import java.io.IOException;
import java.time.Instant;
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
        // 1. 파일이 없거나 비어 있는 경우
        if (file == null || file.isEmpty()) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "파일은 비어 있을 수 없습니다."
            );
        }

        // 2. MIME 타입 검사
        String mimeType = file.getContentType();

        if (mimeType == null || !ALLOWED_MIME_TYPES.contains(mimeType)) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "허용되지 않는 파일 형식입니다."
            );
        }

        // 3. 원본 파일명 확인
        String filename = file.getOriginalFilename();

        if (filename == null || filename.isBlank()) {
            filename = "unnamed-file";
        }

        // 4. ID와 생성 시간 발급
        String id = UUID.randomUUID().toString();
        Instant createdAt = Instant.now();

        try {
            // 5. 업로드된 파일을 byte 배열로 읽기
            byte[] data = file.getBytes();

            // 6. 서버 메모리에 저장
            StoredFile storedFile = new StoredFile(
                    id,
                    filename,
                    mimeType,
                    data,
                    createdAt
            );

            files.put(id, storedFile);

            // 7. 클라이언트에 반환할 메타데이터 생성
            return new FileMeta(
                    id,
                    filename,
                    mimeType,
                    data.length,
                    "/files/" + id,
                    createdAt
            );

        } catch (IOException e) {
            throw new ApiException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "파일을 저장하는 중 오류가 발생했습니다."
            );
        }


    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> download(@PathVariable String id) {
        // TODO: id로 저장된 파일을 찾아서 반환하세요 (없으면 404).
        //       Content-Type 헤더를 업로드 당시 mimeType으로 설정해야 합니다.
        // 1. ID로 파일 조회
        StoredFile storedFile = files.get(id);

        // 2. 파일이 없으면 404
        if (storedFile == null) {
            throw new ApiException(
                    HttpStatus.NOT_FOUND,
                    "파일을 찾을 수 없습니다."
            );
        }

        // 3. 업로드 당시 MIME 타입과 파일 데이터를 응답
        return ResponseEntity
                .ok()
                .contentType(
                        MediaType.parseMediaType(storedFile.mimeType())
                )
                .contentLength(storedFile.data().length)
                .body(storedFile.data());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        // TODO: id로 찾아서 삭제하고, 없으면 404를 던지세요.
        //       성공 시 204 No Content로 응답하세요.
        // remove는 삭제한 객체를 반환하고,
        // 해당 ID가 없으면 null을 반환함
        StoredFile deletedFile = files.remove(id);

        if (deletedFile == null) {
            throw new ApiException(
                    HttpStatus.NOT_FOUND,
                    "파일을 찾을 수 없습니다."
            );
        }
    }
}

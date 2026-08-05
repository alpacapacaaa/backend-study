package com.backendstudy.template;

import java.time.Instant;

// TODO: User 엔티티 클래스 정의
// - id, email, name, password, createdAt, updatedAt 필드
// - password는 JSON 응답에 포함되지 않도록 주의 (UserResponse로 변환해서 반환할 것,
//   User 자체를 절대 컨트롤러에서 직접 반환하지 마세요)
// - createdAt/updatedAt은 반드시 Instant 사용. LocalDateTime은 타임존 정보가 없어서
//   기본 직렬화 시 "2026-08-05T10:00:00" 처럼 'Z'가 빠진 채로 나가고, 이는 명세가
//   요구하는 "ISO 8601, UTC(Z) 형식"을 위반합니다. Instant는 Spring Boot 기본 Jackson
//   설정에서 자동으로 "2026-08-05T10:00:00Z" 형태로 직렬화됩니다.
public class User {
    private String id;
    private String email;
    private String name;
    private String password;
    private Instant createdAt;
    private Instant updatedAt;

    // TODO: 생성자, getter, setter 구현
}

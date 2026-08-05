package com.backendstudy.template;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

// TODO: User 엔티티 클래스 정의
// - id, email, name, password, createdAt, updatedAt 필드
// - JPA 어노테이션 또는 수동 ID 생성

// TODO: RegisterRequest DTO 정의
// - email, password, name 필드
// - 유효성 검증 어노테이션 (@Email, @NotBlank, @Size)

// TODO: LoginRequest DTO 정의
// - email, password 필드

// TODO: UserResponse DTO 정의
// - id, email, name, createdAt, updatedAt 필드

// TODO: AuthResponse DTO 정의
// - token, user 필드

/**
 * 2주차 인증 API 컨트롤러
 * 
 * 학습 포인트:
 * - 사용자 등록 및 비밀번호 해싱 (BCrypt)
 * - JWT 토큰 생성 및 검증
 * - 인증 응답 구조
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    // TODO: UserRepository 또는 인메모리 저장소 주입

    // TODO: PasswordEncoder 주입 (BCrypt)

    // TODO: JWT 토큰 제공자 주입

    /**
     * POST /auth/register - 회원가입
     * 
     * 구현 단계:
     * 1. 요청 유효성 검증
     * 2. 이메일 중복 확인 (409 Conflict)
     * 3. 비밀번호 해싱 (BCrypt)
     * 4. 사용자 저장
     * 5. UserResponse 반환 (201 Created)
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        // TODO: 구현하기
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
            .body(Map.of("error", "TODO: implement register"));
    }

    /**
     * POST /auth/login - 로그인
     * 
     * 구현 단계:
     * 1. 요청 유효성 검증
     * 2. 사용자 찾기 (없으면 401)
     * 3. 비밀번호 검증 (BCrypt)
     * 4. JWT 토큰 생성 (24시간 만료)
     * 5. AuthResponse 반환 (200 OK)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        // TODO: 구현하기
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
            .body(Map.of("error", "TODO: implement login"));
    }
}

// TODO: JWT 토큰 제공자 클래스 구현
// - generateToken(): JWT 생성 (HS256, 24시간 만료)
// - validateToken(): 토큰 검증
// - getUserIdFromToken(): 토큰에서 사용자 ID 추출

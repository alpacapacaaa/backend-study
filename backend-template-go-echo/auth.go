package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

// TODO: User 구조체 정의
// - ID, Email, Name, Password, CreatedAt, UpdatedAt 필드 포함
// - Password는 JSON 응답에 포함되지 않도록 `json:"-"` 태그 사용

// TODO: RegisterRequest 구조체 정의
// - Email, Password, Name 필드 포함

// TODO: LoginRequest 구조체 정의
// - Email, Password 필드 포함

// TODO: UserResponse 구조체 정의
// - ID, Email, Name, CreatedAt, UpdatedAt 필드 포함

// TODO: AuthResponse 구조체 정의
// - Token, User 필드 포함

// TODO: JWT Claims 구조체 정의
// - UserID, Email 필드 포함
// - jwt.RegisteredClaims 임베딩

// TODO: 인메모리 사용자 저장소
// var users = make(map[string]User)

// TODO: JWT 시크릿 키
// var jwtSecret = []byte("your-secret-key")

// registerUser handles POST /auth/register
// 학습 포인트: 사용자 등록, 비밀번호 해싱, 중복 검사, 입력 검증
func registerUser(c echo.Context) error {
	// TODO: 구현하기
	// 1. 요청 바디를 RegisterRequest로 파싱
	// 2. 유효성 검사 (이메일, 비밀번호, 이름 필수, 비밀번호 8자 이상)
	// 3. 이메일 중복 확인 (409 Conflict)
	// 4. 비밀번호 해싱 (bcrypt)
	// 5. User 생성 및 저장
	// 6. UserResponse로 201 반환
	return c.JSON(http.StatusNotImplemented, map[string]string{"error": "TODO: implement registerUser"})
}

// loginUser handles POST /auth/login
// 학습 포인트: 인증 토큰 기반 인증, JWT 생성/검증
func loginUser(c echo.Context) error {
	// TODO: 구현하기
	// 1. 요청 바디를 LoginRequest로 파싱
	// 2. 유효성 검사 (이메일, 비밀번호 필수)
	// 3. 사용자 찾기 (없으면 401)
	// 4. 비밀번호 검증 (bcrypt.CompareHashAndPassword)
	// 5. JWT 토큰 생성 (24시간 만료)
	// 6. AuthResponse로 200 반환
	return c.JSON(http.StatusNotImplemented, map[string]string{"error": "TODO: implement loginUser"})
}

// TODO: generateJWT 함수 구현
// - JWT 토큰 생성 (HS256 알고리즘)
// - Claims에 UserID, Email, 만료시간(24시간) 포함

// TODO: toUserResponse 함수 구현
// - User를 UserResponse로 변환 (비밀번호 제외)

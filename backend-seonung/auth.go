package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

// User represents a user in the system
type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	Password  string    `json:"-"` // Never expose password in responses
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// RegisterRequest represents the request body for user registration
type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

// LoginRequest represents the request body for user login
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// UserResponse represents the user information returned to the client
type UserResponse struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// AuthResponse represents the authentication response with JWT token
type AuthResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

// JWT claims structure
type JWTClaims struct {
	UserID string `json:"userId"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

// TODO: In-memory user storage for development
// In production, use a proper database
var users = make(map[string]User)

// JWT secret key - In production, use environment variable
var jwtSecret = []byte("your-secret-key-change-in-production")

// registerUser handles POST /auth/register
// 학습 포인트: 사용자 등록, 비밀번호 해싱, 중복 검사, 입력 검증
func registerUser(c echo.Context) error {
	var req RegisterRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, ErrorResponse{Error: "잘못된 요청 형식입니다."})
	}

	// Validate input
	if req.Email == "" || req.Password == "" || req.Name == "" {
		return c.JSON(http.StatusBadRequest, ErrorResponse{Error: "이메일, 비밀번호, 이름은 모두 필수입니다."})
	}

	if len(req.Password) < 8 {
		return c.JSON(http.StatusBadRequest, ErrorResponse{Error: "비밀번호는 8자 이상이어야 합니다."})
	}

	// Check if email already exists
	if _, exists := users[req.Email]; exists {
		return c.JSON(http.StatusConflict, ErrorResponse{Error: "이미 등록된 이메일입니다."})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "서버 오류가 발생했습니다."})
	}

	// Create user
	now := time.Now().UTC()
	user := User{
		ID:        fmt.Sprintf("%d", time.Now().UnixNano()), // UnixNano를 이용해 고유한 ID 생성
		Email:     req.Email,
		Name:      req.Name,
		Password:  string(hashedPassword),
		CreatedAt: now,
		UpdatedAt: now,
	}

	users[user.Email] = user

	// Return user response (without password)
	return c.JSON(http.StatusCreated, toUserResponse(user))
}

// loginUser handles POST /auth/login
// 학습 포인트: 인증 토큰 기반 인증, JWT 생성/검증, 토큰 기반 세션 관리
func loginUser(c echo.Context) error {
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, ErrorResponse{Error: "잘못된 요청 형식입니다."})
	}

	// Validate input
	if req.Email == "" || req.Password == "" {
		return c.JSON(http.StatusBadRequest, ErrorResponse{Error: "이메일과 비밀번호는 모두 필수입니다."})
	}

	// Find user
	user, exists := users[req.Email]
	if !exists {
		return c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "이메일 또는 비밀번호가 올바르지 않습니다."})
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "이메일 또는 비밀번호가 올바르지 않습니다."})
	}

	// Generate JWT token
	token, err := generateJWT(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "토큰 생성 중 오류가 발생했습니다."})
	}

	return c.JSON(http.StatusOK, AuthResponse{
		Token: token,
		User:  toUserResponse(user),
	})
}

// generateJWT creates a new JWT token for a user
func generateJWT(user User) (string, error) {
	claims := &JWTClaims{
		UserID: user.ID,
		Email:  user.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// toUserResponse converts User to UserResponse (excludes password)
func toUserResponse(user User) UserResponse {
	return UserResponse{
		ID:        user.ID,
		Email:     user.Email,
		Name:      user.Name,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
}

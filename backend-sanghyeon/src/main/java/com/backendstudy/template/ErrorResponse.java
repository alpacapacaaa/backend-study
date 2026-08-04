package com.backendstudy.template;

// openapi.yaml 공통 에러 포맷: { "error": "메시지" }
public record ErrorResponse(String error) {}

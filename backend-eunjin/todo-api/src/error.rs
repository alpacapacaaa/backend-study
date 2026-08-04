use axum::{
    extract::rejection::{JsonRejection, PathRejection, QueryRejection},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;

#[derive(Debug)]
pub enum ApiError {
    InvalidInput(String),
    NotFound(String),
    MethodNotAllowed(String),
    InternalError(String),
}

impl From<JsonRejection> for ApiError {
    fn from(_: JsonRejection) -> Self {
        Self::InvalidInput("요청 본문 형식이 올바르지 않습니다.".to_string())
    }
}

impl From<QueryRejection> for ApiError {
    fn from(_: QueryRejection) -> Self {
        Self::InvalidInput("쿼리 파라미터 형식이 올바르지 않습니다.".to_string())
    }
}

impl From<PathRejection> for ApiError {
    fn from(_: PathRejection) -> Self {
        Self::InvalidInput("경로 파라미터 형식이 올바르지 않습니다.".to_string())
    }
}

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, error) = match self {
            ApiError::InvalidInput(message) => (StatusCode::BAD_REQUEST, message),
            ApiError::NotFound(message) => (StatusCode::NOT_FOUND, message),
            ApiError::MethodNotAllowed(message) => (StatusCode::METHOD_NOT_ALLOWED, message),
            ApiError::InternalError(message) => (StatusCode::INTERNAL_SERVER_ERROR, message),
        };

        (status, Json(ErrorResponse { error })).into_response()
    }
}
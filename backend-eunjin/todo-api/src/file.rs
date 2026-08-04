use chrono::{DateTime, Utc};
use uuid::Uuid;
use serde::Serialize;
use axum::{
    body::Body,
    response::Response,
    Json,
    extract::{
        multipart::MultipartRejection,
        rejection::PathRejection,
        Multipart,
        Path,
        State,
    },
    http::{
        header::{CONTENT_LENGTH, CONTENT_TYPE},
        StatusCode,
    }
};
use tokio_util::io::ReaderStream;
use std::path::{Path as FsPath, PathBuf};

use crate::state::AppState;
use crate::error::ApiError;


// File metadata 구조체 정의
#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FileMetadata {
    pub id: Uuid,
    pub filename: String,
    pub mime_type: String,
    pub size: u64,
    pub url: String,
    pub created_at: DateTime<Utc>
}

// File 구조체 정의
#[derive(Debug, Clone)]
pub struct File {
    pub meta: FileMetadata,
    pub path: PathBuf,
}


// upload 함수
pub async fn upload_file(
    State(state): State<AppState>,
    multipart: Result<Multipart, MultipartRejection>,
) -> Result<(StatusCode, Json<FileMetadata>), ApiError> {
    let mut multipart = multipart.map_err(|_| ApiError::InvalidInput("파일 업로드 형식이 올바르지 않습니다.".to_string()))?;

    // 파일 처리
    while let Some(field) = multipart.next_field().await.map_err(|_| ApiError::InvalidInput("파일 업로드 중 오류가 발생했습니다.".to_string()))? {
        if field.name() != Some("file") {
            continue; // "file" 필드가 아니면 무시
        }
        let filename = field.file_name().map(|s| s.to_string()).ok_or_else(|| ApiError::InvalidInput("파일 이름이 제공되지 않았습니다.".to_string()))?;
        let mime_type = field.content_type().map(|s| s.to_string()).ok_or_else(|| ApiError::InvalidInput("파일 타입이 제공되지 않았습니다.".to_string()))?;
        let data = field.bytes().await.map_err(|_| ApiError::InvalidInput("파일 데이터를 읽는 중 오류가 발생했습니다.".to_string()))?;

        // 파일 저장 경로 생성
        let file_id = Uuid::new_v4();
        let file_path = state.file_storage_path.join(file_id.to_string());

        // 메타데이터 생성
        let metadata = FileMetadata {
            id: file_id,
            filename,
            mime_type,
            size: data.len() as u64,
            url: format!("/files/{file_id}"),
            created_at: Utc::now(),
        };

        validate_image_type(&metadata.filename, &metadata.mime_type)?;
        if metadata.size > 5 * 1024 * 1024 {
            return Err(ApiError::InvalidInput("파일 크기가 5MB를 초과합니다.".to_string()));
        }

        tokio::fs::write(&file_path, &data).await.map_err(|_| ApiError::InternalError("파일 저장 중 오류가 발생했습니다.".to_string()))?;

        // 상태에 파일 정보 저장
        let file = File {
            meta: metadata.clone(),
            path: file_path,
        };
        
        state.files.write().await.insert(file_id, file);

        return Ok((StatusCode::CREATED, Json(metadata)));
    }

    Err(ApiError::InvalidInput("업로드할 파일이 제공되지 않았습니다.".to_string()))
}

fn validate_image_type(
    filename: &str,
    mime_type: &str,
) -> Result<(), ApiError> {
    let extension = FsPath::new(filename)
        .extension()
        .and_then(|extension| extension.to_str())
        .unwrap_or("")
        .to_ascii_lowercase();
    let valid = matches!((extension.as_str(), mime_type),
    ("jpg" | "jpeg", "image/jpeg")
        | ("png", "image/png")
        | ("gif", "image/gif")
        | ("webp", "image/webp")
    );

    if !valid {
        return Err(ApiError::InvalidInput("지원되지 않는 이미지 형식이거나 확장자와 MIME 타입이 일치하지 않습니다.".to_string()));
    }

    Ok(())
}

pub async fn download_file(
    State(state): State<AppState>,
    file_id: Result<Path<Uuid>, PathRejection>,
) -> Result<Response, ApiError> {
    let Path(file_id) = file_id.map_err(ApiError::from)?;

    let file = {
        let files = state.files.read().await;

        files
            .get(&file_id)
            .cloned()
            .ok_or_else(|| {
                ApiError::NotFound(
                    "파일을 찾을 수 없습니다.".to_string(),
                )
            })?
    };

    let file_path = file.path.clone();
    let file_stream = tokio::fs::File::open(file_path).await.map_err(|_| ApiError::InternalError("파일을 열 수 없습니다.".to_string()))?;
    let stream = ReaderStream::new(file_stream);
    let body = Body::from_stream(stream);

    Response::builder()
        .status(StatusCode::OK)
        .header(CONTENT_TYPE, file.meta.mime_type.clone())
        .header(CONTENT_LENGTH, file.meta.size.to_string())
        .body(body)
        .map_err(|_| ApiError::InternalError("응답 생성 중 오류가 발생했습니다.".to_string()))
}

pub async fn delete_file(
    State(state): State<AppState>,
    file_id: Result<Path<Uuid>, PathRejection>,
) -> Result<StatusCode, ApiError> {
    let Path(file_id) = file_id.map_err(ApiError::from)?;

    let file = {
        let files = state.files.read().await;

        files.get(&file_id)
            .cloned()
            .ok_or_else(|| {
                ApiError::NotFound(
                    "파일을 찾을 수 없습니다.".to_string(),
                )
            })?
    };

    // 파일 삭제
    tokio::fs::remove_file(file.path).await.map_err(|_| ApiError::InternalError("파일 삭제 중 오류가 발생했습니다.".to_string()))?;
    state.files.write().await.remove(&file_id);

    Ok(StatusCode::NO_CONTENT)
}
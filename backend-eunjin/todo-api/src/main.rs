mod todo;
mod state;
mod error;
mod file;

use axum::{
    http::{
        header::{AUTHORIZATION, CONTENT_TYPE},
        HeaderValue,
        Method
    },
    routing::{get, post, delete},
    Router,
    extract::DefaultBodyLimit,
};
use std::net::SocketAddr;
use error::ApiError;
use state::AppState;
use tower_http::cors::CorsLayer;

async fn route_not_found() -> ApiError {
    ApiError::NotFound("요청한 경로를 찾을 수 없습니다.".to_string())
}

#[tokio::main]
async fn main() {
    let state = AppState::default();
    tokio::fs::create_dir_all(state.file_storage_path.as_ref())
        .await
        .expect("파일 저장 디렉토리를 생성할 수 없습니다.");

    // CORS 설정
    let cors = CorsLayer::new()
        .allow_origin(HeaderValue::from_static("http://localhost:3000"))
        .allow_methods(
            [
                Method::GET,
                Method::POST,
                Method::PUT,
                Method::DELETE,
                Method::PATCH,
                Method::OPTIONS,
            ])
        .allow_headers([
            CONTENT_TYPE,
            AUTHORIZATION,
        ]);

    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route("/todos", get(todo::list_todos).post(todo::create_todo))
        .route("/todos/{todoId}", delete(todo::delete_todo).get(todo::get_todo).patch(todo::update_todo))
        .route("/files", post(file::upload_file).layer(DefaultBodyLimit::max(6 * 1024 * 1024))) // 6MB 제한
        .route("/files/{fileId}", get(file::download_file).delete(file::delete_file))
        .fallback(route_not_found)
        .layer(cors)
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8082));
    println!("Listening on {}", addr);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:8082")
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}
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
use state::AppState;
use tower_http::cors::CorsLayer;

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
        .layer(cors)
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8082));
    println!("Listening on {}", addr);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:8082")
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}

#[cfg(test)]
mod tests {
    use axum::{
        body::{to_bytes, Body},
        http::{header::CONTENT_TYPE, Method, Request, StatusCode},
        routing::{delete, get},
        Router,
    };
    use tower::ServiceExt;

    use crate::state::AppState;

    fn test_app() -> Router {
        Router::new()
            .route("/todos", get(crate::todo::list_todos).post(crate::todo::create_todo))
            .route(
                "/todos/{todoId}",
                delete(crate::todo::delete_todo)
                    .get(crate::todo::get_todo)
                    .patch(crate::todo::update_todo),
            )
            .with_state(AppState::default())
    }

    async fn assert_json_error(request: Request<Body>, expected_message: &str) {
        let response = test_app().oneshot(request).await.unwrap();

        assert_eq!(response.status(), StatusCode::BAD_REQUEST);
        assert_eq!(
            response.headers().get(CONTENT_TYPE).unwrap(),
            "application/json"
        );

        let body = to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let expected = format!(r#"{{"error":"{expected_message}"}}"#);
        assert_eq!(String::from_utf8(body.to_vec()).unwrap(), expected);
    }

    #[tokio::test]
    async fn missing_json_field_returns_json_bad_request() {
        let request = Request::builder()
            .method(Method::POST)
            .uri("/todos")
            .header(CONTENT_TYPE, "application/json")
            .body(Body::from(r#"{"description":"제목 없음"}"#))
            .unwrap();

        assert_json_error(request, "요청 본문 형식이 올바르지 않습니다.").await;
    }

    #[tokio::test]
    async fn invalid_query_returns_json_bad_request() {
        let request = Request::builder()
            .uri("/todos?completed=abc")
            .body(Body::empty())
            .unwrap();

        assert_json_error(request, "쿼리 파라미터 형식이 올바르지 않습니다.").await;
    }

    #[tokio::test]
    async fn invalid_path_returns_json_bad_request() {
        let request = Request::builder()
            .uri("/todos/not-a-uuid")
            .body(Body::empty())
            .unwrap();

        assert_json_error(request, "경로 파라미터 형식이 올바르지 않습니다.").await;
    }

    #[tokio::test]
    async fn invalid_patch_field_type_returns_json_bad_request() {
        let request = Request::builder()
            .method(Method::PATCH)
            .uri("/todos/00000000-0000-0000-0000-000000000000")
            .header(CONTENT_TYPE, "application/json")
            .body(Body::from(r#"{"completed":"yes"}"#))
            .unwrap();

        assert_json_error(request, "요청 본문 형식이 올바르지 않습니다.").await;
    }
}
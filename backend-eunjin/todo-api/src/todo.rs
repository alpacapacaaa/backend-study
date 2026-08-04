use chrono::{DateTime, Utc};
use uuid::Uuid;
use serde::{Serialize, Deserialize};
use axum::{
    Json,
    extract::{
        rejection::{JsonRejection, PathRejection, QueryRejection},
        Path, Query, State,
    },
    http::StatusCode,
};
use crate::state::AppState;
use crate::error::ApiError;


// Todo 구조체 정의
#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Todo {
    pub id: Uuid,
    pub title: String,
    pub description: Option<String>,
    pub completed: bool,
    pub due_date: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// CreateTodoRequest 구조체 정의
#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")] // Rust는 기본적으로 snake_case이나 명세에서 camelCase를 요구하므로 바꾸어 전달
pub struct CreateTodoRequest {
    pub title: String,
    pub description: Option<String>,
    pub due_date: Option<DateTime<Utc>>,
}

// ListTodosQuery 구조체 정의
#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ListTodosQuery {
    pub sort: Option<String>,
    pub order: Option<String>,
    pub completed: Option<bool>,
}

// UpdateTodoRequest 구조체 정의
#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UpdateTodoRequest {
    pub title: Option<String>,
    pub description: Option<String>,
    pub due_date: Option<DateTime<Utc>>,
    pub completed: Option<bool>,
}



// 새로운 todo 생성
pub async fn create_todo(
    State(state): State<AppState>,
    input: Result<Json<CreateTodoRequest>, JsonRejection>
) -> Result<(StatusCode, Json<Todo>), ApiError> {
    let Json(input) = input.map_err(ApiError::from)?;

    let title = input.title;
    if title.trim().is_empty() {
        return Err(ApiError::InvalidInput("제목은 비워둘 수 없습니다.".to_string()));
    }
    let description = input.description;
    let due_date = input.due_date;
    let now = Utc::now();

    // 새로운 todo 생성
    let new_todo = Todo {
        id: Uuid::new_v4(),
        title: title,
        description: description,
        completed: false,
        due_date: due_date,
        created_at: now,
        updated_at: now,
    };

    state.todos.write().await.insert(new_todo.id, new_todo.clone());

    Ok((StatusCode::CREATED, Json(new_todo)))
}

// todo 목록 조회
pub async fn list_todos(
    State(state): State<AppState>,
    params: Result<Query<ListTodosQuery>, QueryRejection>
) -> Result<Json<Vec<Todo>>, ApiError> {
    let Query(params) = params.map_err(ApiError::from)?;

    // 쿼리 파라미터 기본값 및 유효성 검사
    let sort = params.sort.as_deref().unwrap_or("createdAt");
    let order = params.order.as_deref().unwrap_or("desc");

    if !matches!(sort, "createdAt" | "dueDate") {
        return Err(ApiError::InvalidInput(
            "sort 파라미터는 createdAt 또는 dueDate 여야 합니다.".to_string(),
        ));
    }

    if !matches!(order, "asc" | "desc") {
        return Err(ApiError::InvalidInput(
            "order 파라미터는 asc 또는 desc 여야 합니다.".to_string(),
        ));
    }

    // todos를 읽기 전용으로 가져오기
    let mut todo_list: Vec<Todo> = {
        let todos = state.todos.read().await;
        todos.values().cloned().collect()
    };

    if let Some(completed) = params.completed {
        todo_list.retain(|todo| todo.completed == completed);
    }

    match sort {
        "createdAt" => todo_list.sort_by(|a, b| a.created_at.cmp(&b.created_at)),
        "dueDate" => todo_list.sort_by(|a, b| a.due_date.cmp(&b.due_date)),
        _ => unreachable!("sort 값은 위에서 검증됨"),
    }
    if order == "desc" {
        todo_list.reverse();
    }

    Ok(Json(todo_list))
}

// todo 단건 조회
pub async fn get_todo(
    State(state): State<AppState>,
    id: Result<Path<Uuid>, PathRejection>
) -> Result<Json<Todo>, ApiError> {
    let Path(id) = id.map_err(ApiError::from)?;

    let todos = state.todos.read().await;
    if let Some(todo) = todos.get(&id) {
        Ok(Json(todo.clone()))
    } else {
        Err(ApiError::NotFound(format!("Todo 항목 {}를 찾을 수 없습니다.", id)))
    }
}

// todo 삭제
pub async fn delete_todo(
    State(state): State<AppState>,
    id: Result<Path<Uuid>, PathRejection>
) -> Result<StatusCode, ApiError> {
    let Path(id) = id.map_err(ApiError::from)?;

    let mut todos = state.todos.write().await;
    if todos.remove(&id).is_some() {
        Ok(StatusCode::NO_CONTENT)
    } else {
        Err(ApiError::NotFound(format!("Todo 항목 {}를 찾을 수 없습니다.", id)))
    }
}

// todo 업데이트
pub async fn update_todo(
    State(state): State<AppState>,
    id: Result<Path<Uuid>, PathRejection>,
    input: Result<Json<UpdateTodoRequest>, JsonRejection>
) -> Result<Json<Todo>, ApiError> {
    let Path(id) = id.map_err(ApiError::from)?;
    let Json(input) = input.map_err(ApiError::from)?;

    let mut todos = state.todos.write().await;

    if let Some(todo) = todos.get_mut(&id) {
        if let Some(title) = input.title {
            if title.trim().is_empty() {
                return Err(ApiError::InvalidInput("제목은 비워둘 수 없습니다.".to_string()));
            }
            todo.title = title;
        }
        if let Some(description) = input.description {
            todo.description = Some(description);
        }
        if let Some(due_date) = input.due_date {
            todo.due_date = Some(due_date);
        }
        if let Some(completed) = input.completed {
            todo.completed = completed;
        }
        todo.updated_at = Utc::now();
        Ok(Json(todo.clone()))
    } else {
        Err(ApiError::NotFound(format!("Todo 항목 {}를 찾을 수 없습니다.", id)))
    }
}
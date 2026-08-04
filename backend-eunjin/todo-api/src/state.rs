use std::{
    collections::HashMap,
    sync::Arc,
    path::PathBuf,
};

use tokio::sync::RwLock;
use uuid::Uuid;

use crate::todo::Todo;
use crate::file::File;

pub type TodoStore = Arc<RwLock<HashMap<Uuid, Todo>>>;
pub type FileStore = Arc<RwLock<HashMap<Uuid, File>>>;

#[derive(Clone)]
pub struct AppState {
    pub(crate) todos: TodoStore,
    pub(crate) files: FileStore,
    pub(crate) file_storage_path: Arc<PathBuf>,
}


impl Default for AppState {
    fn default() -> Self {
        Self {
            todos: Arc::new(RwLock::new(HashMap::new())),
            files: Arc::new(RwLock::new(HashMap::new())),
            file_storage_path: Arc::new(PathBuf::from("./uploaded_files")),
        }
    }
}

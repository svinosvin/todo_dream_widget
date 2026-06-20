// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use tauri_plugin_sql::{Migration, MigrationKind};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

    let widget_db = vec![
    Migration {
        version: 1,
        description: "create_skills",
        sql: include_str!("../migrations/001_create_initial.sql"),
        kind: MigrationKind::Up,
    }];




    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new()
        .add_migrations("sqlite:widget.db", widget_db)
        .build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

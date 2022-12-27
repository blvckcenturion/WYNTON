use crate::models::category::{CategoryNew, CategoryUpdate};
use crate::services;
use crate::AppState;

#[tauri::command]
pub fn create_category(name : String, state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    let item = CategoryNew {
        name: &name,
    };
    services::category::create(conn, &item)
}

#[tauri::command]
pub fn find_by_name_category(name : String, state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::category::find_by_name(conn, &name)
}

#[tauri::command]
pub fn update_category(id : i32, name : String, state: tauri::State<AppState>) {
    let conn = &mut state.conn.lock().unwrap();
    let item = CategoryUpdate {
        name: &name,
    };
    services::category::update(conn, &item, id)
}

#[tauri::command]
pub fn delete_category(id : i32, state: tauri::State<AppState>) {
    let conn = &mut state.conn.lock().unwrap();
    services::category::delete(conn, id)
}

#[tauri::command]
pub fn get_category(id : i32, state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::category::get(conn, id)
}

#[tauri::command]
pub fn get_all_category(state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::category::get_all(conn)
}
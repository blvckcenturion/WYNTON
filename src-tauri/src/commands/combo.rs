use crate::models::combo::{ComboNew, ComboUpdate};
use crate::services;
use crate::AppState;

#[tauri::command]
pub fn create_combo(denomination : String, price : f32, photo : Option<&str>, state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    let item = ComboNew {
        denomination: &denomination,
        price: price,
        photo: photo,
    };
    services::combo::create(conn, &item);
    // retrieve the created combo using the find by name func
    services::combo::find_by_name(conn, &denomination)
}

#[tauri::command]
pub fn find_by_name_combo(denomination : String, state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::combo::find_by_name(conn, &denomination)
}

#[tauri::command]
pub fn update_combo(id : i32, denomination : String, price : f32, photo : Option<&str>, state: tauri::State<AppState>) {
    let conn = &mut state.conn.lock().unwrap();
    let item = ComboUpdate {
        denomination: &denomination,
        price: price,
        photo: photo,
    };
    services::combo::update(conn, &item, id)
}

#[tauri::command]
pub fn delete_combo(id : i32, state: tauri::State<AppState>) {
    let conn = &mut state.conn.lock().unwrap();
    services::combo::delete(conn, id)
}

#[tauri::command]
pub fn delete_combo_items(id : i32, state: tauri::State<AppState>) {
    let conn = &mut state.conn.lock().unwrap();
    services::combo::delete_combo_items(conn, id)
}

#[tauri::command]
pub fn get_combo(id : i32, state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::combo::get(conn, id)
}

#[tauri::command]
pub fn get_all_combo(state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::combo::get_all(conn)
}

#[tauri::command]
pub fn get_all_combo_registered(state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::combo::get_all_registered(conn)
}

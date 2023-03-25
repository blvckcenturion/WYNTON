use crate::models::combo_item::{ComboItemNew, ComboItemUpdate};
use crate::services;
use crate::AppState;

#[tauri::command]
pub fn create_combo_item(combo_id : i32, product_id : i32, quantity : i32, state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    let item = ComboItemNew {
        combo_id: &combo_id,
        product_id: &product_id,
        quantity: &quantity,
    };
    services::combo_item::create(conn, &item)
}

#[tauri::command]
pub fn update_combo_item(id : i32, combo_id : i32, product_id : i32, quantity : i32, state: tauri::State<AppState>) {
    let conn = &mut state.conn.lock().unwrap();
    let item = ComboItemUpdate {
        quantity: &quantity
    };
    services::combo_item::update(conn, &item, id)
}

#[tauri::command]
pub fn delete_combo_item(id : i32, state: tauri::State<AppState>) {
    let conn = &mut state.conn.lock().unwrap();
    services::combo_item::delete(conn, id)
}

#[tauri::command]
pub fn delete_combo_item_by_product(id : i32, state: tauri::State<AppState>) {
    let conn = &mut state.conn.lock().unwrap();
    services::combo_item::delete_by_product(conn, id)
}

#[tauri::command]
pub fn get_combo_item(id : i32, state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::combo_item::get(conn, id)
}

#[tauri::command]
pub fn get_all_combo_item(state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::combo_item::get_all(conn)
}

#[tauri::command]
pub fn get_all_by_combo_id_combo_item(combo_id : i32, state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::combo_item::find_by_combo_id(conn, &combo_id)
}
use crate::models::product::{Product, ProductNew, ProductUpdate};
use crate::services; 
use crate::AppState;


#[tauri::command]
pub fn create_product(name : String, description : Option<str>, price : f32, photo : Option<String>, category_id : Option<i32>,   state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    let item = ProductNew {
        name: &name,
        description: &description,
        price: price,
        photo: &photo,
        category_id: category_id,
    };
    services::product::create(conn, &item)
}

#[tauri::command]
pub fn find_by_name_product(name : String, state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::products::find_by_name(conn, &name)
}

#[tauri::command]
pub fn update_product(id : i32, name : String, state: tauri::State<AppState>) {
    let conn = &mut state.conn.lock().unwrap();
    let item = ProductsUpdate {
        name: &name,
    };
    services::products::update(conn, &item, id)
}

#[tauri::command]
pub fn delete_product(id : i32, state: tauri::State<AppState>) {
    let conn = &mut state.conn.lock().unwrap();
    services::products::delete(conn, id)
}

#[tauri::command]
pub fn get_product(id : i32, state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::products::get(conn, id)
}

#[tauri::command]
pub fn get_all_product(state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::products::get_all(conn)
}
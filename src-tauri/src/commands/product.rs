use crate::models::product::{ProductNew, ProductUpdate};
use crate::services; 
use crate::AppState;


#[tauri::command]
pub fn create_product(name : String, description : Option<&str>, price : f32, photo : Option<&str>, category_id : Option<i32>, state: tauri::State<AppState>) -> String {    

    let conn = &mut state.conn.lock().unwrap();
    let item = ProductNew {
        name: &name,
        description: description,
        price: price,
        photo: photo,
        category_id: category_id,
    };

    services::product::create(conn, &item)
}

#[tauri::command]
pub fn find_by_name_product(name : String, state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::product::find_by_name(conn, &name)
}

#[tauri::command]
pub fn update_product(id : i32, name : String, description : Option<&str>, price : f32, photo : Option<&str>, category_id : Option<i32>, state: tauri::State<AppState>) {
    let conn = &mut state.conn.lock().unwrap();
    let item = ProductUpdate {
        name: &name,
        description: description,
        price: price,
        photo: photo,
        category_id: category_id.as_ref(),
    };
    services::product::update(conn, &item, id)
}

#[tauri::command]
pub fn delete_product(id : i32, state: tauri::State<AppState>) {
    let conn = &mut state.conn.lock().unwrap();
    services::product::delete(conn, id)
}

#[tauri::command]
pub fn get_product(id : i32, state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::product::get(conn, id)
}

#[tauri::command]
pub fn get_all_product(state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::product::get_all(conn)
}

#[tauri::command]
pub fn get_all_product_by_category(id: i32, state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::product::get_all_by_category(conn, id)
}
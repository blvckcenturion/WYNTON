use crate::models::user::{UserNew, UserUpdate};
use crate::services;
use crate::AppState;

#[tauri::command]
// Create a new user
// based on the UserNew struct
// that is: names, last_names, username, password, photo, user_type, user_reference
// those are the func params
pub fn create_user(
    names: String,
    last_names: String,
    username: String,
    password: String,
    photo: Option<String>,
    user_type: i32,
    user_reference: Option<String>,
    state: tauri::State<'_, AppState>
) -> String {
    let mut conn = &mut state.conn.lock().unwrap();
    let user = UserNew {
        names: &names,
        last_names: &last_names,
        username: &username,
        password: &password,
        photo: photo.as_deref(),
        user_type: user_type,
        user_reference: user_reference.as_deref(),
    };
    services::user::create(&mut conn, &user)
}

#[tauri::command]
// Find a user by id
pub fn find_by_id_user(id: i32, state: tauri::State<'_, AppState>) -> String {
    let mut conn = &mut state.conn.lock().unwrap();
    services::user::find_by_id(&mut conn, id)
}

#[tauri::command]
// Update a user
pub fn update_user(
    id: i32,
    names: String,
    last_names: String,
    username: String,
    password: String,
    photo: Option<String>,
    user_type: i32,
    user_reference: Option<String>,
    state: tauri::State<'_, AppState>
) {
    let mut conn = &mut state.conn.lock().unwrap();
    let user = UserUpdate {
        names: &names,
        last_names: &last_names,
        username: &username,
        password: &password,
        photo: photo.as_deref(),
        user_type: user_type,
        user_reference: user_reference.as_deref(),
    };
    services::user::update(&mut conn, &user, id)
}

#[tauri::command]
// Update a user password
pub fn update_password_user(
    id: i32,
    password: String,
    state: tauri::State<'_, AppState>
) {
    let mut conn = &mut state.conn.lock().unwrap();
    services::user::update_password(&mut conn, &password, id)
}


#[tauri::command]
// Delete a user
pub fn delete_user(id: i32, state: tauri::State<'_, AppState>) {
    let mut conn = &mut state.conn.lock().unwrap();
    services::user::delete(&mut conn, id)
}

#[tauri::command]
// Get a user by id
pub fn get_user(id: i32, state: tauri::State<'_, AppState>) -> String {
    let mut conn = &mut state.conn.lock().unwrap();
    services::user::get(&mut conn, id)
}

#[tauri::command]
// Get all users
pub fn get_all_user(state: tauri::State<'_, AppState>) -> String {
    let mut conn = &mut state.conn.lock().unwrap();
    services::user::get_all(&mut conn)
}

#[tauri::command]
// Login
pub fn login_user(
    username: String,
    state: tauri::State<'_, AppState>
) -> String {
    let mut conn = &mut state.conn.lock().unwrap();
    services::user::login(&mut conn, &username)
}
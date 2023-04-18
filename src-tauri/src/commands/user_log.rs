use crate::models::user_log::{UserLogNew, UserLogUpdate};
use crate::services;
use crate::AppState;

// Create user log
#[tauri::command]
pub fn create_user_log(id : i32, state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    let item = UserLogNew {
        user_id: &id,
        login_time: &chrono::Utc::now().naive_utc(),

    };

    let session_id : i32 = services::user_log::create(conn, &item);
    let mut current_user_session = state.current_user_session.lock().unwrap();
    *current_user_session = session_id;
    session_id.to_string()
}

// Update user log
#[tauri::command]
pub fn update_user_log(state: tauri::State<AppState>) {
    let conn = &mut state.conn.lock().unwrap();
    let item = UserLogUpdate {
        id: &state.current_user_session.lock().unwrap(),
    };
    services::user_log::update(conn, &item)
}

// Get all user logs
#[tauri::command]
pub fn get_all_user_logs(state: tauri::State<AppState>) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::user_log::get_all(conn)
}
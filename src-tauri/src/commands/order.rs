use crate::models::order::{OrderNew, OrderItemNew};
use crate::services;
use crate::AppState;

#[tauri::command]
pub fn create_order(
    user_id: i32,
    payment_method: i32,
    state: tauri::State<AppState>,
) -> String {
    let conn = &mut state.conn.lock().unwrap();
    let order = OrderNew {
        user_id: user_id,
        payment_method: payment_method
    };
    services::order::create(conn, &order);

    services::order::find_last_id(conn)
}

#[tauri::command]
pub fn create_order_item(
    order_id: i32,
    product_id: Option<i32>,
    combo_id: Option<i32>,
    quantity: i32,
    price: f32,
    state: tauri::State<AppState>,
) -> String {
    let conn = &mut state.conn.lock().unwrap();
    let item = OrderItemNew {
        order_id: order_id,
        product_id: product_id,
        combo_id: combo_id,
        price: price,
        quantity: quantity,
    };
    services::order::create_order_item(conn, &item)
}

#[tauri::command]
pub fn get_all_order(
    order_status: i32,
    state: tauri::State<AppState>,
) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::order::get_all_order(conn, order_status)
}

#[tauri::command]
pub fn get_all_by_order_id(
    order_id: i32,
    state: tauri::State<AppState>,
) -> String {
    let conn = &mut state.conn.lock().unwrap();
    services::order::get_all_order_item_by_order_id(conn, order_id)
}

#[tauri::command]
pub fn update_order_status(
    status: i32,
    id: i32,
    state: tauri::State<AppState>,
) {
    let conn = &mut state.conn.lock().unwrap();

    services::order::update_order_status(conn, status, id)
}

#[tauri::command]
pub fn delete_order_details(
    id: i32,
    state: tauri::State<AppState>,
) {
    let conn = &mut state.conn.lock().unwrap();

    services::order::delete_order_details(conn, id)
}

#[tauri::command]
pub fn update_order_payment_method(
    payment_method: i32,
    id: i32,
    state: tauri::State<AppState>,
) {
    let conn = &mut state.conn.lock().unwrap();

    services::order::update_order_payment_method(conn, payment_method, id)
}
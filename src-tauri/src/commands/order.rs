use crate::models::order::{OrderNew, OrderItemNew};
use crate::services;
use crate::AppState;

#[tauri::command]
pub fn create_order(
    user_id: i32,
    state: tauri::State<AppState>,
) -> String {
    let conn = &mut state.conn.lock().unwrap();
    let order = OrderNew {
        user_id: user_id,
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
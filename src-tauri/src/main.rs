#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[macro_use]
extern crate diesel;

use std::{sync::Mutex};
use diesel::SqliteConnection;


pub mod schema;
pub mod models;
pub mod db;
pub mod services;
pub mod commands;

pub struct AppState {
    conn: Mutex<SqliteConnection>
}


fn main() {

    let state = AppState {
        conn: Mutex::new(db::establish_connection())
    };

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            commands::category::create_category,
            commands::category::update_category,
            commands::category::delete_category,
            commands::category::get_category,
            commands::category::get_all_category,
            commands::category::find_by_name_category,
            commands::product::create_product,
            commands::product::update_product,
            commands::product::delete_product,
            commands::product::get_product,
            commands::product::get_all_product,
            commands::product::find_by_name_product,
            commands::product::get_all_product_by_category,
            commands::combo::create_combo,
            commands::combo::update_combo,
            commands::combo::delete_combo,
            commands::combo::delete_combo_items,
            commands::combo::get_combo,
            commands::combo::get_all_combo,
            commands::combo::find_by_name_combo,
            commands::combo_item::create_combo_item,
            commands::combo_item::update_combo_item,
            commands::combo_item::delete_combo_item,
            commands::combo_item::get_combo_item,
            commands::combo_item::get_all_combo_item,
            commands::combo_item::get_all_by_combo_id_combo_item,
            commands::combo_item::delete_combo_item_by_product,

        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

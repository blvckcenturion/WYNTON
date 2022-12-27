#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[macro_use]
extern crate diesel;

// #[macro_use] 
// extern crate diesel_migrations;
// use diesel_migrations::{embed_migrations, EmbeddedMigrations};
// pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations/");

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
        conn: Mutex::new(db::establish_connection()),
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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

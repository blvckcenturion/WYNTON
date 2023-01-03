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
use std::env;
use std::path::Path;
use std::fs;


pub mod schema;
pub mod models;
pub mod db;
pub mod services;
pub mod commands;

pub struct AppState {
    conn: Mutex<SqliteConnection>, 
    img_path: String,
}


fn main() {

    let state = AppState {
        conn: Mutex::new(db::establish_connection()),
        img_path: env::var("IMAGES_PATH").expect("IMAGES_PATH must be set")
    };

    if Path::new(&state.img_path).is_dir() {
        println!("Images path exists");
    } else {
        println!("Images path does not exist");
        fs::create_dir_all(&state.img_path).expect("Could not create images path");
    }

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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

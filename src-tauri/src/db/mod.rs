extern crate dotenv;

use diesel::prelude::*;
use dotenv::dotenv;

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = "/Users/blvckcenturion/Dev/projects/WYNTON/wynton.db";
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}
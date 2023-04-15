use chrono;

// Refers to the schema in src\db\schema.rs
use crate::schema::user;

use serde::{Serialize};

#[allow(non_snake_case)]
#[derive(Queryable, Debug, Serialize)]
pub struct User {
    pub id: i32,
    pub names: String,
    pub last_names: String,
    pub username: String,
    pub password: String,
    pub photo: Option<String>,
    pub user_type: i32,
    pub user_reference: Option<String>,
    pub createdAt: chrono::NaiveDateTime,
    pub updatedAt: Option<chrono::NaiveDateTime>,
    pub status: i32,
}

#[derive(Insertable, Serialize, Debug, Clone)]
#[diesel(table_name = user)]
pub struct UserNew<'a> {
    pub names: &'a str,
    pub last_names: &'a str,
    pub username: &'a str,
    pub password: &'a str,
    pub photo: Option<&'a str>,
    pub user_type: i32,
    pub user_reference: Option<&'a str>,
}

#[derive(Insertable, Serialize, Debug, Clone)]
#[diesel(table_name = user)]
pub struct UserUpdatePassword<'a> {
    pub password: &'a str,
}

#[derive(Insertable, Serialize, Debug, Clone)]
#[diesel(table_name = user)]
pub struct UserUpdate<'a> {
    pub names: &'a str,
    pub last_names: &'a str,
    pub username: &'a str,
    pub password: &'a str,
    pub photo: Option<&'a str>,
    pub user_type: i32,
    pub user_reference: Option<&'a str>,
}


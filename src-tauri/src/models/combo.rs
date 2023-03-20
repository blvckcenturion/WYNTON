use chrono;

use crate::schema::combo;

// Makes object of this class json serializable, convert them to json then send them to the user
use serde::{Serialize};

#[derive(Queryable, Serialize, Debug)]
pub struct Combo {
    pub id: i32,
    pub denomination: String,
    pub price: f32,
    pub status: i32,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

#[derive(Insertable, Serialize, Debug, Clone)]
#[diesel(table_name = combo)]
pub struct ComboNew<'a> {
    pub denomination: &'a str,
    pub price: f32,
}

#[derive(Insertable, Serialize, Debug, Clone)]
#[diesel(table_name = combo)]
pub struct ComboUpdate<'a> {
    pub denomination: &'a str,
    pub price: f32,
}
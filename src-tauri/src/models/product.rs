use chrono;

// Refers to the schema in src\db\schema.rs
use crate::schema::product;

// Makes object of this class json serializable, convert them to json then send them to the user
use serde::{Serialize};

#[derive(Queryable, Debug)]
pub struct Product {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub price: f32,
    pub photo: Option<String>,
    pub category_id: Option<i32>,
    pub status: i32,
    pub createdAt: chrono::NaiveDateTime,
    pub updatedAt: Option<chrono::NaiveDateTime>,
}

#[derive(Insertable, Serialize, Debug, Clone)]
#[diesel(table_name = product)]
pub struct NewProduct<'a> {
    pub name: &'a str,
    pub description: Option<&'a str>,
    pub price: f32,
    pub photo: Option<&'a str>,
    pub category_id: Option<i32>,
}
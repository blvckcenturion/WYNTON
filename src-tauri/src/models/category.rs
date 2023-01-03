use chrono;
use crate::schema::category;

// Makes object of this class json serializable, convert them to json then send them to the user
use serde::{Serialize};

#[allow(non_snake_case)]
#[derive(Queryable, Serialize, Debug)]
pub struct Category {
    pub id: i32,
    pub name: String,
    pub status: i32,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

#[derive(Insertable)]
#[diesel(table_name = category)]
pub struct CategoryNew<'a> {
    pub name: &'a str
}

#[derive(Insertable)]
#[diesel(table_name = category)]
pub struct CategoryUpdate<'a> {
    pub name: &'a str
}
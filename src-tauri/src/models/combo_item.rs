use chrono;

use crate::schema::combo_item;

use serde::{Serialize};

#[derive(Queryable, Serialize, Debug)]
pub struct ComboItem {
    pub id: i32,
    pub combo_id: i32,
    pub product_id: i32,
    pub quantity: i32,
    pub status: i32,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

#[derive(Insertable, Serialize, Debug, Clone)]
#[diesel(table_name = combo_item)]
pub struct ComboItemNew<'a> {
    pub combo_id: &'a i32,
    pub product_id: &'a i32,
    pub quantity: &'a i32,
}

#[derive(Insertable, Serialize, Debug, Clone)]
#[diesel(table_name = combo_item)]
pub struct ComboItemUpdate<'a> {
    pub quantity: &'a i32,
}

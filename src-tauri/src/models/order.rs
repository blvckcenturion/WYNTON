use chrono;
use serde_derive::Deserialize;

use crate::schema::{orders, order_item};

use serde::{Serialize};

#[derive(Queryable, Serialize, Debug)]
pub struct Order {
    pub id: i32,
    pub user_id: i32,
    pub payment_method: i32,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub status: i32,
}

#[derive(Insertable, Serialize, Debug, Clone)]
#[diesel(table_name = orders)]
pub struct OrderNew {
    pub user_id: i32,
    pub payment_method: i32,
}

#[derive(Queryable, Serialize, Debug)]
pub struct OrderItem {
    pub id: i32,
    pub order_id: i32,
    pub product_id: Option<i32>,
    pub combo_id: Option<i32>,
    pub quantity: i32,
    pub price: f32,
}

#[derive(Insertable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = order_item)]
pub struct OrderItemNew {
    pub order_id: i32,
    pub product_id: Option<i32>,
    pub combo_id: Option<i32>,
    pub quantity: i32,
    pub price: f32,
}
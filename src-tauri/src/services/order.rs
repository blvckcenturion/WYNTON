use crate::models::order::{Order, OrderNew, OrderItemNew};
use diesel::prelude::*;
use diesel::SqliteConnection;

pub fn create(conn: &mut SqliteConnection, order: &OrderNew) -> String {
    use crate::schema::orders;

    let order = diesel::insert_into(orders::table)
        .values(order)
        .execute(conn)
        .expect("Error");
    serde_json::to_string(&order).unwrap()
}

pub fn find_last_id(conn: &mut SqliteConnection) -> String {
    use crate::schema::orders::dsl::{orders, id};

    let last_id = orders.select(id).order(id.desc()).first::<i32>(conn).unwrap();
    serde_json::to_string(&last_id).unwrap()
}

pub fn create_order_item(conn: &mut SqliteConnection, item: &OrderItemNew) -> String {
    use crate::schema::order_item;

    let order_item = diesel::insert_into(order_item::table)
        .values(item)
        .execute(conn)
        .expect("Error");
    serde_json::to_string(&order_item).unwrap()
}
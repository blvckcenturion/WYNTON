use crate::models::order::{Order, OrderNew, OrderItemNew, OrderItem};
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

pub fn get_all_order(conn: &mut SqliteConnection) -> String {
    use crate::schema::orders::dsl::{orders, status};

    let get_all_order: Vec<Order> = orders.filter(status.eq(1)).load::<Order>(conn).unwrap();
    serde_json::to_string(&get_all_order).unwrap()
}

pub fn get_all_order_item_by_order_id(conn: &mut SqliteConnection, order_id: i32) -> String {
    use crate::schema::order_item::dsl::{order_item, order_id as order_item_order_id};

    let get_all_order_item: Vec<OrderItem> = order_item.filter(order_item_order_id.eq(order_id)).load::<OrderItem>(conn).unwrap();
    serde_json::to_string(&get_all_order_item).unwrap()
}

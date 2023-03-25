use crate::models::combo_item::{ComboItemNew, ComboItemUpdate, ComboItem};
use diesel::prelude::*;
use diesel::SqliteConnection;
use chrono::prelude::*;

pub fn create(conn: &mut SqliteConnection, item: &ComboItemNew) -> String{
    use crate::schema::combo_item;

    let combo_item = diesel::insert_into(combo_item::table)
        .values(item)
        .execute(conn)
        .expect("Error");
    serde_json::to_string(&combo_item).unwrap()
}

pub fn find_by_combo_id(conn: &mut SqliteConnection, combo_id: &i32) -> String{
    use crate::schema::combo_item::dsl::{combo_item, combo_id as combo_item_combo_id, status};

    let find_combo_item : Vec<ComboItem> = combo_item.filter(combo_item_combo_id.eq(combo_id)).filter(status.eq(1)).load::<ComboItem>(conn).unwrap();

    serde_json::to_string(&find_combo_item).unwrap()
}

pub fn update(conn: &mut SqliteConnection, item: &ComboItemUpdate, id: i32){
    use crate::schema::combo_item::dsl::{combo_item, quantity, updatedAt};

    let _ = diesel::update(combo_item.find(id))
        .set((
            quantity.eq(item.quantity),
            updatedAt.eq(Utc::now().naive_utc())
        ))
        .execute(conn)
        .unwrap();
    let _combo_item: ComboItem = combo_item.find(id).first::<ComboItem>(conn).unwrap_or_else(|_| panic!("Unable to find post {}", id));
}

pub fn delete(conn: &mut SqliteConnection, id: i32){
    use crate::schema::combo_item::dsl::{combo_item, updatedAt, status, combo_id};
    // delete combo item by combo id
    let _ = diesel::update(combo_item.filter(combo_id.eq(id)))
        .set((
            status.eq(0),
            updatedAt.eq(Utc::now().naive_utc())
        ))
        .execute(conn)
        .unwrap();
}

pub fn delete_by_product(conn: &mut SqliteConnection, id: i32){
    use crate::schema::combo_item::dsl::{combo_item, updatedAt, status, product_id};
    // delete all combo items that have product_id
    let _ = diesel::update(combo_item.filter(product_id.eq(id)))
        .set((
            status.eq(0),
            updatedAt.eq(Utc::now().naive_utc())
        ))
        .execute(conn)
        .unwrap();
}

pub fn get(conn: &mut SqliteConnection, id: i32) -> String{
    use crate::schema::combo_item::dsl::{combo_item, status};

    let get_combo_item: ComboItem = combo_item.find(id).filter(status.eq(1)).first::<ComboItem>(conn).unwrap_or_else(|_| panic!("Unable to find post {}", id));
    serde_json::to_string(&get_combo_item).unwrap()
}

pub fn get_all(conn: &mut SqliteConnection) -> String{
    use crate::schema::combo_item::dsl::{combo_item, status};

    let get_all_combo_item: Vec<ComboItem> = combo_item.filter(status.eq(1)).load::<ComboItem>(conn).unwrap();
    serde_json::to_string(&get_all_combo_item).unwrap()
}
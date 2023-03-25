use crate::models::combo::{ComboNew, ComboUpdate, Combo};
use diesel::prelude::*;
use diesel::SqliteConnection;
use chrono::prelude::*;

pub fn create(conn: &mut SqliteConnection, item: &ComboNew) -> String{
    use crate::schema::combo;

    let combo = diesel::insert_into(combo::table)
        .values(item)
        .execute(conn)
        .expect("Error");
    serde_json::to_string(&combo).unwrap()
}

pub fn find_by_name(conn: &mut SqliteConnection, name: &str) -> String{
    use crate::schema::combo::dsl::{combo, denomination as combo_denomination, status};

    let find_combo : Vec<Combo> = combo.filter(combo_denomination.eq(name)).filter(status.eq(1)).load::<Combo>(conn).unwrap();

    serde_json::to_string(&find_combo).unwrap()
}

pub fn update(conn: &mut SqliteConnection, item: &ComboUpdate, id: i32){
    use crate::schema::combo::dsl::{combo, denomination, updatedAt, price};

    let _ = diesel::update(combo.find(id))
        .set((
            denomination.eq(item.denomination),
            price.eq(item.price),
            updatedAt.eq(Utc::now().naive_utc())
        ))
        .execute(conn)
        .unwrap();
    let _combo: Combo = combo.find(id).first::<Combo>(conn).unwrap_or_else(|_| panic!("Unable to find post {}", id));
}

pub fn delete(conn: &mut SqliteConnection, id: i32){
    use crate::schema::combo::dsl::{combo, updatedAt, status};

    let _ = diesel::update(combo.find(id))
        .set((
            status.eq(0),
            updatedAt.eq(Utc::now().naive_utc())
        ))
        .execute(conn)
        .unwrap();
}

pub fn delete_combo_items(conn: &mut SqliteConnection, id: i32){
    use crate::schema::combo_item::dsl::{combo_item, combo_id,};
    let _ = diesel::delete(combo_item.filter(combo_id.eq(id)))
        .execute(conn)
        .unwrap();
}

pub fn get(conn: &mut SqliteConnection, id: i32) -> String{
    use crate::schema::combo::dsl::{combo, status};

    let get_combo: Combo = combo.find(id).filter(status.eq(1)).first::<Combo>(conn).unwrap_or_else(|_| panic!("Unable to find post {}", id));
    serde_json::to_string(&get_combo).unwrap()
}

pub fn get_all(conn: &mut SqliteConnection) -> String{
    use crate::schema::combo::dsl::{combo, status};

    let get_combo: Vec<Combo> = combo.filter(status.eq(1)).load::<Combo>(conn).unwrap();
    serde_json::to_string(&get_combo).unwrap()
}

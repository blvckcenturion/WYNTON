use crate::models::category::{CategoryNew, CategoryUpdate, Category};
use diesel::prelude::*;
use diesel::SqliteConnection;
use chrono::prelude::*;

pub fn create(conn: &mut SqliteConnection, item: &CategoryNew) -> String{
    use crate::schema::category;

    let category = diesel::insert_into(category::table)
        .values(item)
        .execute(conn)
        .expect("Error");
    serde_json::to_string(&category).unwrap()
}

pub fn find_by_name(conn: &mut SqliteConnection, name: &str) -> String{
    use crate::schema::category::dsl::{category, name as cat_name, status};

    let cat : Vec<Category> = category.filter(cat_name.eq(name)).filter(status.eq(1)).load::<Category>(conn).unwrap();

    serde_json::to_string(&cat).unwrap()
}

pub fn update(conn: &mut SqliteConnection, item: &CategoryUpdate, id: i32){
    use crate::schema::category::dsl::{category, name, updatedAt};

    let _ = diesel::update(category.find(id))
        .set((
            name.eq(item.name),
            updatedAt.eq(Utc::now().naive_utc())
        ))
        .execute(conn)
        .unwrap();
    let _cat: Category = category.find(id).first::<Category>(conn).unwrap_or_else(|_| panic!("Unable to find post {}", id));
}

pub fn delete(conn: &mut SqliteConnection, id: i32){
    use crate::schema::category::dsl::{category, updatedAt, status};

    let _ = diesel::update(category.find(id))
        .set((
            status.eq(0),
            updatedAt.eq(Utc::now().naive_utc())
        ))
        .execute(conn)
        .unwrap();
}

pub fn get(conn: &mut SqliteConnection, id: i32) -> String{
    use crate::schema::category::dsl::{category, status};

    let cat: Category = category.find(id).filter(status.eq(1)).first::<Category>(conn).unwrap_or_else(|_| panic!("Unable to find post {}", id));
    serde_json::to_string(&cat).unwrap()
}

pub fn get_all(conn: &mut SqliteConnection) -> String{
    use crate::schema::category::dsl::{category, status};

    let cat: Vec<Category> = category.filter(status.eq(1)).load::<Category>(conn).unwrap();
    serde_json::to_string(&cat).unwrap()
}
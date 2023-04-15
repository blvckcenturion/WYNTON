use crate::models::product::{ProductNew, ProductUpdate, Product};
use diesel::prelude::*;
use diesel::SqliteConnection;
use chrono::prelude::*;

pub fn create(conn: &mut SqliteConnection, item: &ProductNew) -> String{
    use crate::schema::product;

    let product = diesel::insert_into(product::table)
        .values(item)
        .execute(conn)
        .expect("Error");
    serde_json::to_string(&product).unwrap()
}

pub fn find_by_name(conn: &mut SqliteConnection, name: &str) -> String{
    use crate::schema::product::dsl::{product, name as prod_name, status};

    let prod : Vec<Product> = product.filter(prod_name.eq(name)).filter(status.eq(1)).load::<Product>(conn).unwrap();

    serde_json::to_string(&prod).unwrap()
}

pub fn update(conn: &mut SqliteConnection, item: &ProductUpdate, id: i32){
    use crate::schema::product::dsl::{product, name, updatedAt, description, price, photo, category_id};
    let _ = diesel::update(product.find(id))
        .set((
            name.eq(item.name),
            description.eq(item.description),
            price.eq(item.price),
            photo.eq(item.photo),
            category_id.eq(item.category_id),
            updatedAt.eq(Utc::now().naive_utc())
        ))
        .execute(conn)
        .unwrap();
    let _prod: Product = product.find(id).first::<Product>(conn).unwrap_or_else(|_| panic!("Unable to find post {}", id));

}

pub fn delete(conn: &mut SqliteConnection, id: i32){
    use crate::schema::product::dsl::{product, updatedAt, status};

    let _ = diesel::update(product.find(id))
        .set((
            status.eq(0),
            updatedAt.eq(Utc::now().naive_utc())
        ))
        .execute(conn)
        .unwrap();
}

pub fn get(conn: &mut SqliteConnection, id: i32) -> String{
    use crate::schema::product::dsl::{product, status};

    let prod: Product = product.find(id).filter(status.eq(1)).first::<Product>(conn).unwrap_or_else(|_| panic!("Unable to find post {}", id));
    serde_json::to_string(&prod).unwrap()
}

pub fn get_all(conn: &mut SqliteConnection) -> String{
    use crate::schema::product::dsl::{product, status};

    let prod: Vec<Product> = product.filter(status.eq(1)).load::<Product>(conn).unwrap();
    serde_json::to_string(&prod).unwrap()
}

pub fn get_all_by_category(conn: &mut SqliteConnection, id: i32) -> String {
    use crate::schema::product::dsl::{product, status as p_status, category_id};
    
    let prod: Vec<Product> = product
        .filter(p_status.eq(1))
        .filter(category_id.eq(id)).load::<Product>(conn).unwrap();
    serde_json::to_string(&prod).unwrap()
}

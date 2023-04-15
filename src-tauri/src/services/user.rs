use crate::models::user::{User, UserNew, UserUpdate};
use diesel::prelude::*;
use diesel::SqliteConnection;
use chrono::prelude::*;

pub fn create(conn: &mut SqliteConnection, item: &UserNew) -> String{
    use crate::schema::user;

    let user = diesel::insert_into(user::table)
        .values(item)
        .execute(conn)
        .expect("Error");
    serde_json::to_string(&user).unwrap()
}

pub fn find_by_id(conn: &mut SqliteConnection, id: i32) -> String{
    use crate::schema::user::dsl::{user, status, id as user_id};

    let u : Vec<User> = user.filter(user_id.eq(id)).filter(status.eq_any([1,2])).load::<User>(conn).unwrap();

    serde_json::to_string(&u).unwrap()
}

pub fn update(conn: &mut SqliteConnection, item: &UserUpdate, id: i32){
    use crate::schema::user::dsl::{user, names, last_names, updatedAt, username, password, photo, user_type, user_reference};

    let _ = diesel::update(user.find(id))
        .set((
            names.eq(item.names),
            last_names.eq(item.last_names),
            username.eq(item.username),
            password.eq(item.password),
            photo.eq(item.photo),
            user_type.eq(item.user_type),
            user_reference.eq(item.user_reference),
            updatedAt.eq(Utc::now().naive_utc())
        ))
        .execute(conn)
        .unwrap();
    let _user: User = user.find(id).first::<User>(conn).unwrap_or_else(|_| panic!("Unable to find post {}", id));

}

pub fn update_password(conn: &mut SqliteConnection, password: &str, id: i32){
    use crate::schema::user::dsl::{user, updatedAt, password as user_password};

    let _ = diesel::update(user.find(id))
        .set((
            user_password.eq(password),
            updatedAt.eq(Utc::now().naive_utc())
        ))
        .execute(conn)
        .unwrap();
    let _user: User = user.find(id).first::<User>(conn).unwrap_or_else(|_| panic!("Unable to find post {}", id));

}

pub fn delete(conn: &mut SqliteConnection, id: i32){
    use crate::schema::user::dsl::{user, updatedAt, status};

    let _ = diesel::update(user.find(id))
        .set((
            status.eq(0),
            updatedAt.eq(Utc::now().naive_utc())
        ))
        .execute(conn)
        .unwrap();
}

pub fn get(conn: &mut SqliteConnection, id: i32) -> String{
    use crate::schema::user::dsl::{user, status};

    let u: User = user.find(id).filter(status.eq(1)).first::<User>(conn).unwrap_or_else(|_| panic!("Unable to find post {}", id));
    serde_json::to_string(&u).unwrap()
}

pub fn get_all(conn: &mut SqliteConnection) -> String{
    use crate::schema::user::dsl::{user, status};

    let users : Vec<User> = user.filter(status.eq(1)).load::<User>(conn).unwrap();

    serde_json::to_string(&users).unwrap()
}

pub fn login(conn: &mut SqliteConnection, username: &str) -> String{
    use crate::schema::user::dsl::{user, username as user_username, status};

    let u : Vec<User> = user.filter(user_username.eq(username)).filter(status.eq_any([1,2])).load::<User>(conn).unwrap();

    serde_json::to_string(&u).unwrap()
}
use crate::models::user_log::{UserLogNew, UserLogUpdate, UserLogList, UserLog};
use diesel::prelude::*;
use diesel::SqliteConnection;
use chrono::prelude::*;

pub fn create(conn: &mut SqliteConnection, item: &UserLogNew) -> i32{
    use crate::schema::user_log;

    let u_log = diesel::insert_into(user_log::table)
        .values(item)
        .execute(conn)
        .expect("Error");

    // get session id and set it to state
    let user_session: UserLog = user_log::table.order(user_log::id.desc()).first::<UserLog>(conn).unwrap_or_else(|_| panic!("Unable to find post"));
    
    user_session.id

    
}

pub fn update(conn: &mut SqliteConnection, item: &UserLogUpdate){
    use crate::schema::user_log::dsl::{user_log,logout_time};

    let _ = diesel::update(user_log.find(item.id))
        .set(logout_time.eq(Utc::now().naive_utc()))
        .execute(conn)
        .unwrap();
    let _user_log: UserLog = user_log.find(item.id).first::<UserLog>(conn).unwrap_or_else(|_| panic!("Unable to find post {}", item.id));
}

// Get all logs and join with user
pub fn get_all(conn: &mut SqliteConnection) -> String{
    use crate::schema::user_log::dsl::{user_log, id as user_log_id, user_id as user_log_user_id, login_time, logout_time};
    use crate::schema::user::dsl::{user, id as user_id, names as user_names, last_names as user_last_names, username as user_username, status as user_status};

    let u_log: Vec<UserLogList> = user_log
        .inner_join(
            user.on(user_id.eq(user_log_user_id))
        )
        .select((user_log_id, user_id, login_time, logout_time, user_names, user_last_names, user_username, user_status))
        .load::<UserLogList>(conn)
        .unwrap();

    serde_json::to_string(&u_log).unwrap()
}

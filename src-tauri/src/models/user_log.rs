use chrono;

use crate::schema::user_log;

use serde::{Serialize};

#[derive(Queryable, Debug, Serialize)]
pub struct UserLog {
    pub id: i32,
    pub user_id: i32,
    pub login_time: chrono::NaiveDateTime,
    pub logout_time: Option<chrono::NaiveDateTime>,
}

#[derive(Queryable, Debug, Serialize)]
pub struct UserLogList {
    pub id: i32,
    pub user_id: i32,
    pub login_time: chrono::NaiveDateTime,
    pub logout_time: Option<chrono::NaiveDateTime>,
    pub names: String,
    pub last_names: String,
    pub username: String,
    pub status: i32,
}

#[derive(Insertable, Serialize, Debug, Clone)]
#[diesel(table_name = user_log)]
pub struct UserLogNew<'a> {
    pub user_id: &'a i32,
    pub login_time: &'a chrono::NaiveDateTime,
}

#[derive(Insertable, Serialize, Debug, Clone)]
#[diesel(table_name = user_log)]
pub struct UserLogUpdate<'a> {
    pub id: &'a i32,
}


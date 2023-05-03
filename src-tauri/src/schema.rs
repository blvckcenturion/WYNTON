// @generated automatically by Diesel CLI.

diesel::table! {
    category (id) {
        id -> Integer,
        name -> Text,
        status -> Integer,
        createdAt -> Timestamp,
        updatedAt -> Nullable<Timestamp>,
    }
}

diesel::table! {
    combo (id) {
        id -> Integer,
        denomination -> Text,
        price -> Float,
        status -> Integer,
        createdAt -> Timestamp,
        updatedAt -> Nullable<Timestamp>,
    }
}

diesel::table! {
    combo_item (id) {
        id -> Integer,
        combo_id -> Integer,
        product_id -> Integer,
        quantity -> Integer,
        status -> Integer,
        createdAt -> Timestamp,
        updatedAt -> Nullable<Timestamp>,
    }
}

diesel::table! {
    order_item (id) {
        id -> Integer,
        order_id -> Integer,
        product_id -> Nullable<Integer>,
        combo_id -> Nullable<Integer>,
        quantity -> Integer,
        price -> Float,
    }
}

diesel::table! {
    orders (id) {
        id -> Integer,
        user_id -> Integer,
        createdAt -> Timestamp,
        updatedAt -> Nullable<Timestamp>,
        status -> Integer,
    }
}

diesel::table! {
    product (id) {
        id -> Integer,
        name -> Text,
        description -> Nullable<Text>,
        price -> Float,
        photo -> Nullable<Text>,
        category_id -> Nullable<Integer>,
        status -> Integer,
        createdAt -> Timestamp,
        updatedAt -> Nullable<Timestamp>,
    }
}

diesel::table! {
    user (id) {
        id -> Integer,
        names -> Text,
        last_names -> Text,
        username -> Text,
        password -> Text,
        photo -> Nullable<Text>,
        user_type -> Integer,
        user_reference -> Nullable<Text>,
        createdAt -> Timestamp,
        updatedAt -> Nullable<Timestamp>,
        status -> Integer,
    }
}

diesel::table! {
    user_log (id) {
        id -> Integer,
        user_id -> Integer,
        login_time -> Timestamp,
        logout_time -> Nullable<Timestamp>,
    }
}

diesel::joinable!(order_item -> combo (combo_id));
diesel::joinable!(order_item -> orders (order_id));
diesel::joinable!(order_item -> product (product_id));
diesel::joinable!(orders -> user (user_id));
diesel::joinable!(user_log -> user (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    category,
    combo,
    combo_item,
    order_item,
    orders,
    product,
    user,
    user_log,
);

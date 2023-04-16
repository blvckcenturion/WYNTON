// @generated automatically by Diesel CLI.
// Aclaration for status:
// 0: Deleted
// 1: Active

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

diesel::allow_tables_to_appear_in_same_query!(
    category,
    combo,
    combo_item,
    product,
    user,
);

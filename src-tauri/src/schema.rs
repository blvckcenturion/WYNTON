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

diesel::allow_tables_to_appear_in_same_query!(
    category,
    combo,
    combo_item,
    product,
);

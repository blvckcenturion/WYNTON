-- Your SQL goes here
-- payment_method: 
-- 1: card
-- 2: qr
-- 3: cash
CREATE TABLE orders(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    payment_method INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP,
    status INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE order_item(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER,
    combo_id INTEGER,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES product(id),
    CONSTRAINT fk_combo FOREIGN KEY (combo_id) REFERENCES combo(id),
    CHECK ((product_id IS NOT NULL AND combo_id IS NULL) OR (product_id IS NULL AND combo_id IS NOT NULL))
);
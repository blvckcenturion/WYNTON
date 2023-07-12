-- This file should undo anything in `up.sql`
-- Drop the recreated 'orders' table if it exists
DROP TABLE IF EXISTS orders;

-- Recreate the original 'orders' table without the 'orders_type' field
CREATE TABLE orders(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    payment_method INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP,
    status INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user(id)
);

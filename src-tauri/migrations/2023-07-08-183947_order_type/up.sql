-- Your SQL goes here
-- Add the new column 'orders_type' to the 'orders' table
-- Drop the existing 'orders' table if it exists
DROP TABLE IF EXISTS orders;

-- Create the new 'orders' table with the additional 'orders_type' field
-- order_type: 1 - local, 2 - delivery service
CREATE TABLE orders(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    payment_method INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP,
    status INTEGER NOT NULL DEFAULT 1,
    order_type INTEGER NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user(id)
);

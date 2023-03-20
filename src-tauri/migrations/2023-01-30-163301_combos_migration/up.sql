-- Your SQL goes here
CREATE TABLE combo (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    denomination VARCHAR(100) NOT NULL,
    price REAL NOT NULL,
    status INTEGER NOT NULL DEFAULT 1,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP
);

CREATE TABLE combo_item (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    combo_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    status INTEGER NOT NULL DEFAULT 1,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP,
    CONSTRAINT fk_combo FOREIGN KEY (combo_id) REFERENCES Combo(id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES Product(id)
);
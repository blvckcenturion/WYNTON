-- Your SQL goes here
CREATE TABLE user(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    names VARCHAR(100) NOT NULL,
    last_names VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    photo VARCHAR(100),
    user_type INTEGER NOT NULL,
    user_reference VARCHAR(1000),
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP,
    status INTEGER NOT NULL DEFAULT 1
);

INSERT INTO user (names, last_names, username, password, user_type)
VALUES ('admin', 'admin', 'admin', '$2a$10$XlatuzTCS6UtGWoNFx1QDuPuBtxvux92hBweGD6a7hMDynhjkaE2G', 3);
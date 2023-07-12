import { Database } from 'sqlite3';

const oldDb = new Database('path_to_old_database.db');
const newDb = new Database('path_to_new_database.db');

oldDb.serialize(() => {
    oldDb.all("SELECT * FROM orders", (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }

        newDb.serialize(() => {
            newDb.run("BEGIN TRANSACTION");

            const statement = newDb.prepare(
                "INSERT INTO orders (id, user_id, payment_method, createdAt, updatedAt, status, order_type) VALUES (?, ?, ?, ?, ?, ?, ?)"
            );

            for (const row of rows) {
                statement.run(row.id, row.user_id, row.payment_method, row.createdAt, row.updatedAt, row.status, 1 /*order_type value*/, (err) => {
                    if (err) {
                        console.error(err);
                        newDb.run("ROLLBACK");
                        return;
                    }
                });
            }

            statement.finalize((err) => {
                if (err) {
                    console.error(err);
                    newDb.run("ROLLBACK");
                    return;
                }

                newDb.run("COMMIT");
            });
        });
    });
});

oldDb.close();
newDb.close();
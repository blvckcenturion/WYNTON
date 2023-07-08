const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../../wynton.db');

function deleteOrdersUntilDate(date) {
  db.run(
    'DELETE FROM orders WHERE createdAt <= ?',
    [date],
    function (err) {
      if (err) {
        console.error('Error deleting orders:', err);
      } else {
        console.log(`Deleted ${this.changes} orders created before ${date}`);
      }
    }
  );
}

// Usage: Pass the date in the format 'YYYY-MM-DD'
const dateToDelete = '2023-07-30';
deleteOrdersUntilDate(dateToDelete);

// Close the database connection when done
db.close();
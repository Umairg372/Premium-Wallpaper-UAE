const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join('server', 'database', 'wallpapers.db'));

db.all('SELECT * FROM wallpapers', [], (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Wallpapers:', JSON.stringify(rows, null, 2));
  }
  db.close();
});
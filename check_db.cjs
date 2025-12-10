const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, 'server', 'database', 'wallpapers.db');
const db = new sqlite3.Database(dbPath);

console.log('Checking database at:', dbPath);

// Check if there are any records
db.serialize(() => {
  // First, let's check if the table exists and get some info
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='wallpapers';", (err, row) => {
    if (err) {
      console.error('Error checking table:', err);
      return;
    }
    
    if (!row) {
      console.log('Table "wallpapers" does not exist!');
      db.close();
      return;
    }

    console.log('Table "wallpapers" exists.');

    // Now check if there are any records
    db.each("SELECT COUNT(*) AS total FROM wallpapers", (err, row) => {
      if (err) {
        console.error('Count error:', err);
      } else {
        console.log('Total wallpapers in database:', row.total);
      }
    });

    // Get a few sample records
    db.all("SELECT * FROM wallpapers LIMIT 5", (err, rows) => {
      if (err) {
        console.error('Select error:', err);
      } else {
        console.log('Sample records:', rows);
      }
      
      if (rows && rows.length > 0) {
        console.log('First wallpaper details:');
        console.log('  ID:', rows[0].id);
        console.log('  Name:', rows[0].name);
        console.log('  Category:', rows[0].category);
        console.log('  Color:', rows[0].color);
        console.log('  PageType:', rows[0].pageType);
        console.log('  ImagePath:', rows[0].imagePath);
        console.log('  ImageUrl:', rows[0].imageUrl);
      }
      
      db.close();
    });
  });
});
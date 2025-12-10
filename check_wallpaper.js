const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Query to check wallpapers
db.serialize(() => {
  console.log('=== Checking wallpapers in database ===');
  
  // Get all wallpapers
  db.all('SELECT id, name, category, color, pageType FROM wallpapers ORDER BY id DESC LIMIT 20', [], (err, rows) => {
    if (err) {
      console.error('Error fetching wallpapers:', err);
      return;
    }
    
    console.log(`Found ${rows.length} wallpapers in database:`);
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Name: "${row.name}", Category: "${row.category}", Color: "${row.color}", PageType: "${row.pageType}"`);
    });
    
    // Specifically check for wallpaper ID 28
    db.get('SELECT * FROM wallpapers WHERE id = 28', [], (err, row) => {
      if (err) {
        console.error('Error fetching wallpaper ID 28:', err);
      } else if (row) {
        console.log('\n=== Details for wallpaper ID 28 ===');
        console.log(`ID: ${row.id}`);
        console.log(`Name: ${row.name}`);
        console.log(`Category: ${row.category}`);
        console.log(`Color: ${row.color}`);
        console.log(`PageType: ${row.pageType}`);
        console.log(`ImageUrl: ${row.imageUrl}`);
        console.log(`CreatedAt: ${row.createdAt}`);
      } else {
        console.log('\nWallpaper ID 28 not found in database');
      }
      
      db.close((closeErr) => {
        if (closeErr) {
          console.error('Error closing database:', closeErr);
        } else {
          console.log('\nDatabase connection closed.');
        }
      });
    });
  });
});
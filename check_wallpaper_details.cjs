const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Query to check wallpaper ID 28 with all image URLs
db.serialize(() => {
  console.log('=== Checking wallpaper ID 28 details ===');
  
  db.get('SELECT * FROM wallpapers WHERE id = 28', [], (err, row) => {
    if (err) {
      console.error('Error fetching wallpaper ID 28:', err);
    } else if (row) {
      console.log(`ID: ${row.id}`);
      console.log(`Name: ${row.name}`);
      console.log(`Category: ${row.category}`);
      console.log(`Color: ${row.color}`);
      console.log(`PageType: ${row.pageType}`);
      console.log(`ImagePath: ${row.imagePath}`);
      console.log(`ImageUrl: ${row.imageUrl}`);
      console.log(`ThumbnailUrl: ${row.thumbnailUrl}`);
      console.log(`MediumUrl: ${row.mediumUrl}`);
      console.log(`WebpUrl: ${row.webpUrl}`);
      console.log(`Width: ${row.width}`);
      console.log(`Height: ${row.height}`);
      console.log(`CreatedAt: ${row.createdAt}`);
    } else {
      console.log('Wallpaper ID 28 not found in database');
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
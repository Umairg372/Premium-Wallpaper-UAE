const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Connect to the database
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Get wallpaper ID 28 to verify current values
db.get('SELECT * FROM wallpapers WHERE id = 28', [], (err, row) => {
  if (err) {
    console.error('Error fetching wallpaper ID 28:', err);
    return;
  }
  
  if (row) {
    console.log('Current record for wallpaper ID 28:');
    console.log(`ImageUrl: ${row.imageUrl}`);
    console.log(`ThumbnailUrl: ${row.thumbnailUrl}`);
    console.log(`MediumUrl: ${row.mediumUrl}`);
    console.log(`WebpUrl: ${row.webpUrl}`);
    
    // Check if the files exist
    const publicDir = path.join(__dirname, 'public');
    const checkFileExists = (urlPath) => {
      const filePath = path.join(publicDir, urlPath);
      return fs.existsSync(filePath);
    };
    
    console.log('\nFile existence check:');
    console.log(`Main image exists: ${checkFileExists(row.imageUrl)}`);
    console.log(`Thumbnail exists: ${checkFileExists(row.thumbnailUrl)}`);
    console.log(`Medium exists: ${checkFileExists(row.mediumUrl)}`);
    console.log(`WebP exists: ${checkFileExists(row.webpUrl)}`);
    
    // Look for the correct files that actually exist
    const uploadsDir = path.join(publicDir, 'uploads', 'wallpapers');
    const files = fs.readdirSync(uploadsDir);
    
    const mainImageFile = files.find(f => f.includes('1764842002718-238506380') && f.endsWith('.jpg'));
    const thumbImageFile = files.find(f => f.includes('1764842002720-208328934') && f.includes('-thumb.jpg'));
    const mediumImageFile = files.find(f => f.includes('1764842002720-208328934') && f.includes('-medium.jpg'));
    const webpImageFile = files.find(f => f.includes('1764842002720-208328934') && f.includes('.webp'));
    
    console.log('\nActual files found:');
    console.log(`Main image: ${mainImageFile}`);
    console.log(`Thumb image: ${thumbImageFile}`);
    console.log(`Medium image: ${mediumImageFile}`);
    console.log(`WebP image: ${webpImageFile}`);
    
    if (mainImageFile && thumbImageFile && mediumImageFile && webpImageFile) {
      // Update the database with correct file paths
      const updateSql = `
        UPDATE wallpapers 
        SET imageUrl = ?, thumbnailUrl = ?, mediumUrl = ?, webpUrl = ?
        WHERE id = ?
      `;
      const params = [
        `/uploads/wallpapers/${mainImageFile}`,
        `/uploads/wallpapers/${thumbImageFile}`,
        `/uploads/wallpapers/${mediumImageFile}`,
        `/uploads/wallpapers/${webpImageFile}`,
        28
      ];
      
      db.run(updateSql, params, function(err) {
        if (err) {
          console.error('Error updating wallpaper:', err);
        } else {
          console.log('\nDatabase updated successfully with correct file paths!');
        }
        
        db.close((closeErr) => {
          if (closeErr) {
            console.error('Error closing database:', closeErr);
          } else {
            console.log('\nDatabase connection closed.');
          }
        });
      });
    } else {
      console.log('\nSome expected files were not found in the uploads directory');
      db.close();
    }
  } else {
    console.log('Wallpaper ID 28 not found in database');
    db.close();
  }
});
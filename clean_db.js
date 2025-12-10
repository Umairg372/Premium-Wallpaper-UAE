import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function cleanDatabase() {
  try {
    // Open the database
    const db = await open({
      filename: './database.db',
      driver: sqlite3.Database
    });

    // Update records that have 'undefined' as a string in color field
    await db.run("UPDATE wallpapers SET color = 'default' WHERE color = 'undefined'");
    console.log('Updated color field to replace "undefined" with "default"');
    
    // Update records that have 'undefined' as a string in other fields
    await db.run("UPDATE wallpapers SET category = 'uncategorized' WHERE category = 'undefined'");
    console.log('Updated category field to replace "undefined" with "uncategorized"');
    
    await db.run("UPDATE wallpapers SET pageType = 'collections' WHERE pageType = 'undefined'");
    console.log('Updated pageType field to replace "undefined" with "collections"');

    // Check for records with empty imageUrl
    const emptyImageUrlRecords = await db.all("SELECT id, name FROM wallpapers WHERE imageUrl = '' OR imageUrl IS NULL");
    if (emptyImageUrlRecords.length > 0) {
      console.log('Records with empty imageUrl that may need attention:', emptyImageUrlRecords);
    }

    // Show updated state of the database
    const wallpapers = await db.all('SELECT * FROM wallpapers');
    console.log('Total wallpapers in DB after cleanup:', wallpapers.length);
    
    if (wallpapers.length > 0) {
      console.log('Sample wallpaper records after cleanup:');
      wallpapers.slice(0, 5).forEach(wallpaper => {
        console.log({
          id: wallpaper.id,
          name: wallpaper.name,
          category: wallpaper.category,
          color: wallpaper.color,
          pageType: wallpaper.pageType,
          imageUrl: wallpaper.imageUrl,
          thumbnailUrl: wallpaper.thumbnailUrl
        });
      });
    }

    await db.close();
    console.log('Database cleanup completed');
  } catch (error) {
    console.error('Error cleaning database:', error);
  }
}

cleanDatabase();
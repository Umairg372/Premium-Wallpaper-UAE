import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function deleteBadRecord() {
  try {
    // Open the database
    const db = await open({
      filename: './database.db',
      driver: sqlite3.Database
    });

    // Delete the record with empty imageUrl
    await db.run("DELETE FROM wallpapers WHERE imageUrl = '' OR imageUrl IS NULL");
    console.log('Deleted records with empty imageUrl');
    
    // Show final state of the database
    const wallpapers = await db.all('SELECT * FROM wallpapers');
    console.log('Total wallpapers in DB after cleanup:', wallpapers.length);
    
    if (wallpapers.length > 0) {
      console.log('Final wallpaper records:');
      wallpapers.forEach(wallpaper => {
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

deleteBadRecord();
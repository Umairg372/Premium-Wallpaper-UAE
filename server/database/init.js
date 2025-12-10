import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.join(__dirname, 'wallpapers.db');

console.log('DEBUG: Database path:', dbPath);

// Create a single, shared database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database connection established.');
  }
});

export function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS wallpapers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          color TEXT NOT NULL,
          pageType TEXT NOT NULL CHECK(pageType IN ('collections', 'kids', '3d', 'stickers', 'colors', 'videos')),
          imagePath TEXT,
          imageUrl TEXT,
          videoPath TEXT,
          videoUrl TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating wallpapers table:', err);
          return reject(err);
        }
        console.log('Wallpapers table ready');

        // --- Add new columns for image optimization ---
        const addColumn = (columnName, columnType) => {
          return new Promise((res, rej) => {
            db.all(`PRAGMA table_info(wallpapers);`, (err, rows) => {
              if (err) {
                console.error(`Error checking columns for wallpapers table: ${err}`);
                return rej(err);
              }
              const columnExists = rows.some(col => col.name === columnName);
              if (!columnExists) {
                db.run(`ALTER TABLE wallpapers ADD COLUMN ${columnName} ${columnType};`, (err) => {
                  if (err) {
                    console.error(`Error adding column ${columnName}:`, err);
                    return rej(err);
                  }
                  console.log(`Column ${columnName} added to wallpapers table.`);
                  res();
                });
              } else {
                console.log(`Column ${columnName} already exists.`);
                res();
              }
            });
          });
        };

        // Update existing columns to allow NULL if they were previously NOT NULL
        const updateColumnToAllowNull = (columnName) => {
          return new Promise((res, rej) => {
            // Add a new column with the same name + '_temp'
            const tempColName = `${columnName}_temp`;
            db.run(`ALTER TABLE wallpapers ADD COLUMN ${tempColName} TEXT;`, (err) => {
              if (err) {
                // Column might already exist, continue
                console.log(`Column ${columnName} modification in progress`);
              }

              // Copy data from old column to new column
              db.run(`UPDATE wallpapers SET ${tempColName} = ${columnName};`, (updateErr) => {
                if (updateErr) {
                  console.log(`Update for ${columnName} might not be needed`);
                }

                // Drop the old column
                db.run(`CREATE TABLE wallpapers_new (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  category TEXT NOT NULL,
                  color TEXT NOT NULL,
                  pageType TEXT NOT NULL CHECK(pageType IN ('collections', 'kids', '3d', 'stickers', 'colors', 'videos')),
                  imagePath TEXT,
                  imageUrl TEXT,
                  videoPath TEXT,
                  videoUrl TEXT,
                  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                  thumbnailUrl TEXT,
                  mediumUrl TEXT,
                  webpUrl TEXT,
                  width INTEGER,
                  height INTEGER
                );`, (createErr) => {
                  if (createErr) {
                    console.log("New table might already exist, trying different approach");
                    // If creating new table fails, try updating schema directly
                    res(); // Continue with the rest
                    return;
                  }

                  // This approach is getting complex, let's use a simpler approach below
                  res();
                });
              });
            });
          });
        };

        // Update the schema to make imagePath and imageUrl optionally null for video-only wallpapers
        const updateSchemaForVideoWallpapers = () => {
          return new Promise((res, rej) => {
            // This is a complex operation in SQLite. The proper way is to:
            // 1. Create a new table with the correct schema
            // 2. Copy all data from the old table
            // 3. Drop the old table
            // 4. Rename the new table to the original name
            // 5. Recreate any indexes or triggers

            const newTableSql = `
              CREATE TABLE wallpapers_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                color TEXT NOT NULL,
                pageType TEXT NOT NULL CHECK(pageType IN ('collections', 'kids', '3d', 'stickers', 'colors', 'videos')),
                imagePath TEXT,
                imageUrl TEXT,
                videoPath TEXT,
                videoUrl TEXT,
                thumbnailUrl TEXT,
                mediumUrl TEXT,
                webpUrl TEXT,
                width INTEGER,
                height INTEGER,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
              )
            `;

            const copyDataSql = `
              INSERT INTO wallpapers_new SELECT
                id, name, category, color, pageType,
                imagePath, imageUrl, videoPath, videoUrl,
                thumbnailUrl, mediumUrl, webpUrl, width, height,
                createdAt, updatedAt
              FROM wallpapers
            `;

            const renameTableSql = `
              ALTER TABLE wallpapers RENAME TO wallpapers_old
            `;

            const renameBackSql = `
              ALTER TABLE wallpapers_new RENAME TO wallpapers
            `;

            const dropOldTableSql = `
              DROP TABLE wallpapers_old
            `;

            // First, let's check if the table needs to be updated by checking the current schema
            db.all("PRAGMA table_info(wallpapers);", (err, rows) => {
              if (err) {
                console.error("Error checking wallpaper table schema:", err);
                return res(); // Continue anyway
              }

              // Check if imagePath and imageUrl columns allow NULL
              const imagePathCol = rows.find(col => col.name === 'imagePath');
              const imageUrlCol = rows.find(col => col.name === 'imageUrl');

              const imagePathAllowsNull = !imagePathCol.notnull;  // notnull is 0 if column allows NULL
              const imageUrlAllowsNull = !imageUrlCol.notnull;

              if (imagePathAllowsNull && imageUrlAllowsNull) {
                // Schema is already updated, continue
                console.log("Wallpaper table schema already updated for video wallpapers");
                return res();
              }

              console.log("Updating wallpaper table schema to support video-only wallpapers...");

              // Perform the schema migration
              db.serialize(() => {
                // 1. Create new table with updated schema
                db.run(newTableSql, (createErr) => {
                  if (createErr) {
                    console.error("Error creating new wallpaper table:", createErr);
                    // If new table already exists (migration in progress), continue to next step
                    if (createErr.message.includes("already exists")) {
                      return res();
                    }
                    return res(); // Continue anyway
                  }

                  // 2. Copy all data from old table to new table
                  db.run(copyDataSql, (copyErr) => {
                    if (copyErr) {
                      console.error("Error copying data during schema migration:", copyErr);
                      // Drop the new table and continue
                      db.run("DROP TABLE IF EXISTS wallpapers_new;", () => {
                        return res();
                      });
                      return;
                    }

                    // 3. Rename old table
                    db.run(renameTableSql, (renameErr) => {
                      if (renameErr) {
                        console.error("Error renaming old wallpaper table:", renameErr);
                        // Drop the new table and continue
                        db.run("DROP TABLE IF EXISTS wallpapers_new;", () => {
                          return res();
                        });
                        return;
                      }

                      // 4. Rename new table to original name
                      db.run(renameBackSql, (renameBackErr) => {
                        if (renameBackErr) {
                          console.error("Error renaming new wallpaper table:", renameBackErr);
                          // Rename the old table back to original name
                          db.run("ALTER TABLE wallpapers_old RENAME TO wallpapers;", () => {
                            return res();
                          });
                          return;
                        }

                        // 5. Drop old table
                        db.run(dropOldTableSql, (dropErr) => {
                          if (dropErr) {
                            console.warn("Warning: Could not drop old wallpaper table:", dropErr);
                          }

                          console.log("Wallpaper table schema updated successfully for video wallpapers");
                          res();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        };

        // Handle schema migration for existing databases
        updateSchemaForVideoWallpapers()
          .then(() => addColumn('thumbnailUrl', 'TEXT'))
          .then(() => addColumn('mediumUrl', 'TEXT'))
          .then(() => addColumn('webpUrl', 'TEXT'))
          .then(() => addColumn('width', 'INTEGER'))
          .then(() => addColumn('height', 'INTEGER'))
          .then(() => {
            // ... existing admin_password table creation ...
            db.run(`
              CREATE TABLE IF NOT EXISTS admin_password (
                id INTEGER PRIMARY KEY,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
              )
            `, (err) => {
              if (err) {
                console.error('Error creating admin_password table:', err);
                return reject(err);
              }
              console.log('Admin password table ready');

              // Create a table for contact messages
              db.run(`
                CREATE TABLE IF NOT EXISTS contact_messages (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  email TEXT NOT NULL,
                  phone TEXT NOT NULL,
                  message TEXT NOT NULL,
                  preferred_date TEXT,
                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
              `, (err) => {
                if (err) {
                  console.error('Error creating contact_messages table:', err);
                  return reject(err);
                }
                console.log('Contact messages table ready');
                resolve();
              });
            });
          })
          .catch(reject); // Catch any errors in the schema migration or column addition promises
      });
    });
  });
}

// Export the raw db instance
export { db };

import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import sharp from 'sharp'; // Import sharp
import { db } from '../database/init.js'; // Import the raw db instance
import { authenticateToken } from '../middleware/auth.js';

console.log('--- wallpapers.js loaded ---');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define image processing constants
const THUMBNAIL_WIDTH = 300;  // Increased from 200 for better quality thumbnails
const MEDIUM_WIDTH = 1000;    // Increased from 800 for better medium quality
const WEBP_QUALITY = 90;      // Increased from 80 for better webp quality
const UPLOADS_BASE_DIR = path.join(__dirname, '../../public/uploads'); // Base for all uploads

/**
 * Processes an image using sharp to create various sizes and formats.
 * @param {string} originalFilePath - The full path to the original uploaded file.
 * @param {string} originalFileName - The original filename with extension.
 * @param {string} uploadSubDir - The subdirectory where the image should be stored (e.g., 'wallpapers').
 * @returns {Promise<{thumbnailPath: string, thumbnailUrl: string, mediumPath: string, mediumUrl: string, webpPath: string, webpUrl: string, originalImageUrl: string}>} - Paths and URLs of generated images.
 */
async function processImageAndSave(originalFilePath, originalFileName, uploadSubDir) {
  const fileExtension = path.extname(originalFileName);
  const baseName = path.basename(originalFileName, fileExtension);
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

  const finalBaseName = `${baseName}-${uniqueSuffix}`;
  const targetDir = path.join(UPLOADS_BASE_DIR, uploadSubDir);

  // Ensure target directory exists
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const output = {
    thumbnailPath: '',
    thumbnailUrl: '',
    mediumPath: '',
    mediumUrl: '',
    webpPath: '',
    webpUrl: '',
    originalImageUrl: `/uploads/${uploadSubDir}/${path.basename(originalFilePath)}`, // This should be the URL to the original file saved by Multer
    originalWidth: 0,
    originalHeight: 0,
  };

  try {
    const metadata = await sharp(originalFilePath).metadata();
    output.originalWidth = metadata.width || 0;
    output.originalHeight = metadata.height || 0;
    // Thumbnail
    output.thumbnailPath = path.join(targetDir, `${finalBaseName}-thumb.jpg`);
    await sharp(originalFilePath)
      .resize(THUMBNAIL_WIDTH, null, { fit: 'inside' })
      .toFormat('jpeg')
      .jpeg({ quality: 90, chromaSubsampling: '4:2:0', mozjpeg: true })
      .toFile(output.thumbnailPath);
    output.thumbnailUrl = `/uploads/${uploadSubDir}/${path.basename(output.thumbnailPath)}`;

    // Medium size
    output.mediumPath = path.join(targetDir, `${finalBaseName}-medium.jpg`);
    await sharp(originalFilePath)
      .resize(MEDIUM_WIDTH, null, { fit: 'inside' })
      .toFormat('jpeg')
      .jpeg({ quality: 95, chromaSubsampling: '4:2:0', mozjpeg: true })
      .toFile(output.mediumPath);
    output.mediumUrl = `/uploads/${uploadSubDir}/${path.basename(output.mediumPath)}`;

    // WebP version
    output.webpPath = path.join(targetDir, `${finalBaseName}.webp`);
    await sharp(originalFilePath)
      .toFormat('webp')
      .webp({ quality: WEBP_QUALITY, effort: 4 }) // effort 4 is good balance of speed/quality
      .toFile(output.webpPath);
    output.webpUrl = `/uploads/${uploadSubDir}/${path.basename(output.webpPath)}`;

  } catch (error) {
    console.error(`Error processing image ${originalFileName}:`, error);
    // Clean up any partially created files
    [output.thumbnailPath, output.mediumPath, output.webpPath].forEach(p => {
      if (existsSync(p)) unlinkSync(p);
    });
    throw new Error('Image processing failed.');
  }

  return output;
}

const router = express.Router();

// Multer config remains the same...
const uploadsDir = path.join(__dirname, '../../public/uploads/wallpapers');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `wallpaper-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const fileFilter = (req, file, cb) => {
  console.log(`[fileFilter] Received file: ${file.originalname}, mimetype: ${file.mimetype}`);
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  if (allowedTypes.test(path.extname(file.originalname).toLowerCase()) && allowedTypes.test(file.mimetype)) {
    console.log(`[fileFilter] File ${file.originalname} is allowed.`);
    return cb(null, true);
  }
  console.log(`[fileFilter] File ${file.originalname} is NOT allowed. Mimetype: ${file.mimetype}, Extname: ${path.extname(file.originalname).toLowerCase()}`);
  cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed!'));
};
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });


// Multer config for videos
const videoUploadsDir = path.join(__dirname, '../../public/uploads/videos');
if (!existsSync(videoUploadsDir)) {
  mkdirSync(videoUploadsDir, { recursive: true });
}
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, videoUploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `wallpaper-video-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const videoFileFilter = (req, file, cb) => {
  console.log(`[videoFileFilter] Received file: ${file.originalname}, mimetype: ${file.mimetype}`);
  const allowedTypes = /mp4|webm|mov/;
  if (allowedTypes.test(path.extname(file.originalname).toLowerCase())) {
    console.log(`[videoFileFilter] File ${file.originalname} is allowed.`);
    return cb(null, true);
  }
  console.log(`[videoFileFilter] File ${file.originalname} is NOT allowed. Mimetype: ${file.mimetype}, Extname: ${path.extname(file.originalname).toLowerCase()}`);
  cb(new Error('Only video files (mp4, webm, mov) are allowed!'));
};
const uploadVideo = multer({ storage: videoStorage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter: videoFileFilter });


// POST video for a wallpaper
router.post('/:id/video', authenticateToken, uploadVideo.single('video'), (req, res) => {
  console.log(`[POST /wallpapers/:id/video] Request received for ID: ${req.params.id}`);
  if (!req.file) {
    console.log(`[POST /wallpapers/:id/video] No video file provided for ID: ${req.params.id}`);
    return res.status(400).json({ error: 'No video file provided' });
  }
  console.log(`[POST /wallpapers/:id/video] File uploaded: ${req.file.originalname}, Path: ${req.file.path}`);

  const wallpaperId = req.params.id;
  const videoPath = req.file.path;
  const videoUrl = `/uploads/videos/${path.basename(req.file.filename)}`;

  const sql = 'UPDATE wallpapers SET videoPath = ?, videoUrl = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?';
  const params = [videoPath, videoUrl, wallpaperId];

  db.run(sql, params, function(err) {
    if (err) {
      console.error(`[POST /wallpapers/:id/video] DATABASE ERROR: ${err.message}`);
      if (req.file && existsSync(req.file.path)) unlinkSync(req.file.path);
      return res.status(500).json({ error: 'Failed to upload video.' });
    }
    if (this.changes === 0) {
      console.log(`[POST /wallpapers/:id/video] Wallpaper not found for ID: ${wallpaperId}`);
      if (req.file && existsSync(req.file.path)) unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Wallpaper not found' });
    }
    console.log(`[POST /wallpapers/:id/video] Video uploaded successfully for ID: ${wallpaperId}, URL: ${videoUrl}`);
    res.status(200).json({ message: 'Video uploaded successfully', videoUrl });
  });
});


// GET all wallpapers
router.get('/', (req, res) => {
  const { pageType, category, color } = req.query;
  let sql = 'SELECT * FROM wallpapers WHERE 1=1';
  const params = [];

  // Only filter by pageType if it's not 'all'
  if (pageType && pageType !== 'all') {
    sql += ' AND pageType = ?';
    params.push(pageType);
  }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (color) { sql += ' AND color = ?'; params.push(color); }
  sql += ' ORDER BY createdAt DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error(`[GET /wallpapers] DATABASE ERROR: ${err.message}`);
      return res.status(500).json({ error: 'Failed to fetch wallpapers from database.' });
    }
    res.json(rows);
  });
});

// GET single wallpaper
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM wallpapers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error(`[GET /wallpapers/:id] DATABASE ERROR: ${err.message}`);
      return res.status(500).json({ error: 'Failed to fetch wallpaper.' });
    }
    if (!row) {
      console.log(`[GET /wallpapers/:id] Wallpaper not found for ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Wallpaper not found' });
    }
    res.json(row);
  });
});

// GET categories
router.get('/meta/categories', (req, res) => {
  db.all('SELECT DISTINCT category FROM wallpapers ORDER BY category', [], (err, rows) => {
    if (err) {
      console.error(`[GET /meta/categories] DATABASE ERROR: ${err.message}`);
      return res.status(500).json({ error: 'Failed to fetch categories.' });
    }
    res.json(rows.map(c => c.category));
  });
});

// POST new wallpaper
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  console.log(`[POST /wallpapers/upload] Single upload request received.`);
  if (!req.file) {
    console.log(`[POST /wallpapers/upload] No image file provided.`);
    return res.status(400).json({ error: 'No image file provided' });
  }

  const { name, category, color, pageType } = req.body;
  if (!name || !category || !color || !pageType) {
    console.log(`[POST /wallpapers/upload] Missing required fields. Name: ${name}, Category: ${category}, Color: ${color}, PageType: ${pageType}`);
    // Clean up original uploaded file if required fields are missing
    unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Ensure values are not 'undefined' or 'null' strings
  const cleanName = name === 'undefined' || name === 'null' ? 'Wallpaper' : name;
  const cleanCategory = category === 'undefined' || category === 'null' ? 'uncategorized' : category;
  const cleanColor = color === 'undefined' || color === 'null' ? 'default' : color;
  const cleanPageType = pageType === 'undefined' || pageType === 'null' ? 'collections' : pageType;

  let processedImages;
  try {
    processedImages = await processImageAndSave(req.file.path, req.file.originalname, 'wallpapers');
  } catch (imageProcessError) {
    console.error(`[POST /wallpapers/upload] Image processing failed:`, imageProcessError);
    unlinkSync(req.file.path); // Clean up original file
    return res.status(500).json({ error: 'Failed to process image.' });
  }

  const { thumbnailUrl, mediumUrl, webpUrl, originalImageUrl, originalWidth, originalHeight } = processedImages;
  const imagePath = req.file.path; // Path to original full-size image
  const imageUrl = originalImageUrl; // Public URL to original full-size image

  const sql = `INSERT INTO wallpapers (name, category, color, pageType, imagePath, imageUrl, thumbnailUrl, mediumUrl, webpUrl, width, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [cleanName, cleanCategory, cleanColor, cleanPageType, imagePath, imageUrl, thumbnailUrl, mediumUrl, webpUrl, originalWidth, originalHeight];

  db.run(sql, params, function (err) {
    if (err) {
      console.error(`[POST /wallpapers/upload] DATABASE ERROR: ${err.message}`);
      // Clean up all generated files if DB insert fails
      if (req.file && existsSync(req.file.path)) unlinkSync(req.file.path);
      if (existsSync(processedImages.thumbnailPath)) unlinkSync(processedImages.thumbnailPath);
      if (existsSync(processedImages.mediumPath)) unlinkSync(processedImages.mediumPath);
      if (existsSync(processedImages.webpPath)) unlinkSync(processedImages.webpPath);
      return res.status(500).json({ error: 'Failed to upload wallpaper.' });
    }
    console.log(`[POST /wallpapers/upload] Wallpaper uploaded successfully. ID: ${this.lastID}, URL: ${imageUrl}`);
    res.status(201).json({ id: this.lastID, name, category, color, pageType, imagePath, imageUrl, thumbnailUrl, mediumUrl, webpUrl, width: originalWidth, height: originalHeight });
  });
});

// POST bulk wallpapers
router.post('/bulk', authenticateToken, upload.array('wallpapers', 100), async (req, res) => {
  console.log(`[POST /wallpapers/bulk] Bulk upload request received.`);
  if (!req.files || req.files.length === 0) {
    console.log(`[POST /wallpapers/bulk] No image files provided.`);
    return res.status(400).json({ error: 'No image files provided' });
  }
  console.log(`[POST /wallpapers/bulk] ${req.files.length} files received.`);

  const { pageType, category, color: rawColor } = req.body;
  const color = rawColor && rawColor !== 'undefined' && rawColor !== 'null' ? rawColor : 'default'; // Assuming 'default' or handling for color in bulk

  // Check for 'undefined' or 'null' strings and handle them properly
  const cleanPageType = pageType === 'undefined' || pageType === 'null' ? 'collections' : pageType;
  const cleanCategory = category === 'undefined' || category === 'null' ? 'uncategorized' : category;

  if (!cleanPageType || !cleanCategory) {
    console.log(`[POST /wallpapers/bulk] Missing required fields. PageType: ${cleanPageType}, Category: ${cleanCategory}`);
    // Ensure req.files is an array for forEach
    if (Array.isArray(req.files)) {
      req.files.forEach(file => unlinkSync(file.path));
    }
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let successfulUploads = 0;
  const wallpapersToInsert = [];
  const filesToCleanup = [];

  // Ensure req.files is an array for iteration
  const filesToProcess = Array.isArray(req.files) ? req.files : [];

  for (const file of filesToProcess) {
    let processedImages;
    try {
      processedImages = await processImageAndSave(file.path, file.originalname, 'wallpapers');
      filesToCleanup.push(file.path, processedImages.thumbnailPath, processedImages.mediumPath, processedImages.webpPath);

      const name = path.basename(file.originalname, path.extname(file.originalname));
      const imagePath = file.path; // Path to original full-size image
      const imageUrl = processedImages.originalImageUrl; // Public URL to original full-size image
      const { thumbnailUrl, mediumUrl, webpUrl, originalWidth, originalHeight } = processedImages;

      wallpapersToInsert.push([name, cleanCategory, color, cleanPageType, imagePath, imageUrl, thumbnailUrl, mediumUrl, webpUrl, originalWidth, originalHeight]);
      successfulUploads++;

    } catch (error) {
      console.error(`[POST /wallpapers/bulk] Image processing or preparation failed for file ${file.originalname}: ${error}`);
      // Clean up the original file if processing fails for it
      if (existsSync(file.path)) unlinkSync(file.path);
      // Continue to next file
    }
  }

  if (wallpapersToInsert.length > 0) {
    // Execute all inserts in a transaction and count successful ones
    let successfulInserts = 0;
    const totalToProcess = wallpapersToInsert.length;

    // Use a counter to track when all database operations are complete
    let completedOperations = 0;

    db.serialize(() => {
      db.run('BEGIN TRANSACTION', (transactErr) => {
        if (transactErr) {
          console.error(`[POST /wallpapers/bulk] Transaction begin error:`, transactErr);
          db.run('ROLLBACK');
          // Clean up files
          filesToCleanup.forEach(p => {
            if (existsSync(p)) unlinkSync(p);
          });
          if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to start transaction.' });
          }
          return;
        }

        const sql = `INSERT INTO wallpapers (name, category, color, pageType, imagePath, imageUrl, thumbnailUrl, mediumUrl, webpUrl, width, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // Process each wallpaper with individual error handling
        for (const wallpaper of wallpapersToInsert) {
          db.run(sql, wallpaper, function(err) {
            completedOperations++;

            if (err) {
              console.error(`[POST /wallpapers/bulk] Database insert error for wallpaper:`, err);
            } else {
              successfulInserts++; // Only increment if there's no error
            }

            // Check if all operations are completed
            if (completedOperations === totalToProcess) {
              db.run('COMMIT', (commitErr) => {
                if (commitErr) {
                  console.error(`[POST /wallpapers/bulk] Bulk database commit error:`, commitErr);
                  // Clean up files on commit error
                  filesToCleanup.forEach(p => {
                    if (existsSync(p)) unlinkSync(p);
                  });
                  if (!res.headersSent) {
                    res.status(500).json({ error: 'Failed to commit wallpapers metadata.' });
                  }
                } else {
                  console.log(`[POST /wallpapers/bulk] Bulk database insert finished. Processed: ${totalToProcess}, Successful: ${successfulInserts}`);
                  if (!res.headersSent) {
                    if (successfulInserts > 0) {
                      res.status(200).json({ message: `${successfulInserts} wallpaper(s) successfully processed for upload.` });
                    } else {
                      res.status(200).json({ message: 'No wallpapers successfully processed for upload.' });
                    }
                  }
                }
              });
            }
          });
        }
      });
    });

  } else {
    res.status(200).json({ message: 'No wallpapers successfully processed for upload.' });
  }
});

// POST new video wallpaper independently
router.post('/upload-video-wallpaper', authenticateToken, uploadVideo.single('video'), (req, res) => {
  console.log(`[POST /wallpapers/upload-video-wallpaper] Request received.`);
  if (!req.file) {
    console.log(`[POST /wallpapers/upload-video-wallpaper] No video file provided.`);
    return res.status(400).json({ error: 'No video file provided' });
  }

  const { name: rawName, pageType: rawPageType, category: rawCategory, color: rawColor } = req.body;
  const name = rawName && rawName !== 'undefined' && rawName !== 'null' ? rawName : 'Video Wallpaper';
  if (!rawName || rawName === 'undefined' || rawName === 'null') {
    console.log(`[POST /wallpapers/upload-video-wallpaper] Invalid name provided: ${rawName}`);
  }

  const videoPath = req.file.path;
  const videoUrl = `/uploads/videos/${path.basename(req.file.filename)}`;

  const pageType = rawPageType && rawPageType !== 'undefined' && rawPageType !== 'null' ? rawPageType : 'collections';
  const category = rawCategory && rawCategory !== 'undefined' && rawCategory !== 'null' ? rawCategory : 'uncategorized';
  const color = rawColor && rawColor !== 'undefined' && rawColor !== 'null' ? rawColor : 'default';

  const sql = `INSERT INTO wallpapers (name, category, color, pageType, imagePath, imageUrl, videoPath, videoUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [name, category, color, pageType, '', '', videoPath, videoUrl];

  db.run(sql, params, function(err) {
    if (err) {
      console.error(`[POST /wallpapers/upload-video-wallpaper] DATABASE ERROR: ${err.message}`);
      if (req.file && existsSync(req.file.path)) unlinkSync(req.file.path);
      return res.status(500).json({ error: 'Failed to upload video wallpaper.' });
    }
    console.log(`[POST /wallpapers/upload-video-wallpaper] Video wallpaper uploaded successfully. ID: ${this.lastID}, URL: ${videoUrl}`);
    res.status(201).json({ id: this.lastID, name, category, color, pageType, videoPath, videoUrl });
  });
});

// PUT update wallpaper
router.put('/:id', authenticateToken, (req, res) => {
  const { name: rawName, category: rawCategory, color: rawColor, pageType: rawPageType } = req.body;

  db.get('SELECT * FROM wallpapers WHERE id = ?', [req.params.id], (err, existing) => {
    if (err) {
      console.error(`[PUT /wallpapers/:id] DATABASE ERROR (SELECT): ${err.message}`);
      return res.status(500).json({ error: 'Failed to update wallpaper.' });
    }
    if (!existing) {
      console.log(`[PUT /wallpapers/:id] Wallpaper not found for ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Wallpaper not found' });
    }

    // Handle 'undefined' and 'null' string values
    const name = rawName !== 'undefined' && rawName !== 'null' ? rawName : existing.name;
    const category = rawCategory !== 'undefined' && rawCategory !== 'null' ? rawCategory : existing.category;
    const color = rawColor !== 'undefined' && rawColor !== 'null' ? rawColor : existing.color;
    const pageType = rawPageType !== 'undefined' && rawPageType !== 'null' ? rawPageType : existing.pageType;

    const sql = 'UPDATE wallpapers SET name = ?, category = ?, color = ?, pageType = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?';
    const params = [name, category, color, pageType, req.params.id];

    db.run(sql, params, (err) => {
      if (err) {
        console.error(`[PUT /wallpapers/:id] DATABASE ERROR (UPDATE): ${err.message}`);
        return res.status(500).json({ error: 'Failed to update wallpaper.' });
      }
      console.log(`[PUT /wallpapers/:id] Wallpaper ID ${req.params.id} updated successfully.`);
      res.json({ message: 'Wallpaper updated successfully' });
    });
  });
});

// DELETE wallpaper
router.delete('/:id', authenticateToken, (req, res) => {
  db.get('SELECT * FROM wallpapers WHERE id = ?', [req.params.id], (err, wallpaper) => {
    if (err) {
      console.error(`[DELETE /wallpapers/:id] DATABASE ERROR (SELECT): ${err.message}`);
      return res.status(500).json({ error: 'Failed to delete wallpaper.' });
    }
    if (!wallpaper) {
      console.log(`[DELETE /wallpapers/:id] Wallpaper not found for ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Wallpaper not found' });
    }

    db.run('DELETE FROM wallpapers WHERE id = ?', [req.params.id], (err) => {
      if (err) {
        console.error(`[DELETE /wallpapers/:id] DATABASE ERROR (DELETE): ${err.message}`);
        return res.status(500).json({ error: 'Failed to delete wallpaper.' });
      }

      if (wallpaper.imagePath && existsSync(wallpaper.imagePath)) {
        try {
          unlinkSync(wallpaper.imagePath);
          console.log(`[DELETE /wallpapers/:id] Image file deleted: ${wallpaper.imagePath}`);
        } catch (fileError) {
          console.error(`[DELETE /wallpapers/:id] Error deleting file ${wallpaper.imagePath}: ${fileError.message}`);
        }
      }
      console.log(`[DELETE /wallpapers/:id] Wallpaper ID ${req.params.id} deleted successfully.`);
      res.json({ message: 'Wallpaper deleted successfully' });
    });
  });
});

export default router;
# Wallpaper Database Management System

## Overview

This system allows you to upload and manage wallpapers through a web interface with a SQLite database backend. You can upload images from your laptop and manage them through the admin panel.

## Setup Instructions

### 1. Install Dependencies

First, install all required dependencies:

```bash
npm install
```

This will install both frontend and backend dependencies including:
- Express.js (backend server)
- SQLite3 (database)
- Multer (file uploads)
- CORS (cross-origin requests)

### 2. Start the Development Server

The project is configured to run both the frontend (Vite) and backend (Express) servers simultaneously:

```bash
npm run dev
```

This will start:
- Frontend server on `http://localhost:8080`
- Backend API server on `http://localhost:3012`

### 3. Access the Admin Panel

Navigate to the admin panel in your browser:
```
http://localhost:8080/admin
```

## Using the Admin Panel

### Uploading Wallpapers

1. Click the "Upload Wallpaper" button
2. Select an image file from your computer
3. Fill in the details:
   - **Name**: Wallpaper name
   - **Page Type**: Choose from Collections, Kids, 3D Wallpapers, Stickers, or Colors
   - **Category**: Select appropriate category
   - **Color**: Select the primary color
4. Click "Upload"

### Managing Wallpapers

- **Search**: Use the search bar to find wallpapers by name or category
- **Filter**: Filter by page type using the dropdown
- **Edit**: Click "Edit" on any wallpaper to update its details
- **Delete**: Click "Delete" to remove a wallpaper (this also deletes the image file)

## Database Structure

The system uses SQLite database located at:
```
server/database/wallpapers.db
```

### Database Schema

```sql
CREATE TABLE wallpapers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  color TEXT NOT NULL,
  pageType TEXT NOT NULL,
  imagePath TEXT NOT NULL,
  imageUrl TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## File Storage

Uploaded images are stored in:
```
public/uploads/wallpapers/
```

Images are automatically renamed with unique identifiers to prevent conflicts.

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/wallpapers` - Get all wallpapers (supports query params: pageType, category, color)
- `GET /api/wallpapers/:id` - Get single wallpaper
- `POST /api/wallpapers` - Upload new wallpaper (multipart/form-data)
- `PUT /api/wallpapers/:id` - Update wallpaper metadata
- `DELETE /api/wallpapers/:id` - Delete wallpaper
- `GET /api/wallpapers/meta/categories` - Get all categories
- `GET /api/health` - Health check endpoint

## Frontend Integration

The frontend automatically fetches wallpapers from the API. The `ProductGallery` component:
1. First tries to fetch from the API
2. Falls back to the file system if the API is unavailable

This ensures backward compatibility during migration.

## Troubleshooting

### Database not initializing
- Check that the `server/database/` directory exists
- Ensure SQLite3 is properly installed

### Images not displaying
- Verify the backend server is running on port 3012
- Check that images are being saved to `public/uploads/wallpapers/`
- Ensure CORS is properly configured

### Upload fails
- Check file size (limit is 10MB)
- Verify file type (only jpg, jpeg, png, webp, gif allowed)
- Check server console for error messages

## Production Deployment

For production:
1. Set environment variables in `.env` file
2. Use a production database (consider PostgreSQL)
3. Configure proper file storage (consider cloud storage)
4. Set up proper authentication for admin panel
5. Configure CORS for your domain

## Notes

- The database is automatically created on first run
- Image files are stored locally in the `public/uploads/` directory
- The system supports both API-based and file-based wallpaper loading for compatibility


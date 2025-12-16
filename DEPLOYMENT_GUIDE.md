# Deployment Guide for Premium Wallpaper UAE

This guide explains how to deploy your application with full functionality (frontend, backend, and database).

## Architecture

Your application consists of:
- Frontend: React/Vite application (deployed to Vercel)
- Backend: Node.js/Express server with SQLite database (deployed to Render.com)
- Database: SQLite file database

## Deployment Steps

### 1. Deploy Backend API to Render.com

1. Create a new Web Service on [Render](https://render.com)
2. Connect to your GitHub repository
3. Select the `render.yaml` file in your repository
4. Configure environment variables in the Render dashboard:
   - `JWT_SECRET`: Your JWT secret key (generate a strong random string)
   - `EMAIL_USER`: Your email address for contact forms
   - `EMAIL_PASS`: Your email app password
   - `TWILIO_ACCOUNT_SID`: Your Twilio account SID
   - `TWILIO_AUTH_TOKEN`: Your Twilio auth token
   - `TWILIO_PHONE_NUMBER`: Your Twilio phone number

5. Deploy the service

### 2. Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Create a new project and connect to your GitHub repository
3. In the project settings, add environment variables:
   - `VITE_PROD_API_URL`: The full URL to your Render backend (e.g., `https://your-app-name.onrender.com`)
4. Vercel will automatically build and deploy your frontend

### 3. Environment Configuration

For development, copy `.env.example` to `.env` and set your values.

For production deployment, set these values in your hosting platform's dashboard.

### 4. Database Migration

On first deployment to Render:
1. Your SQLite database will be created automatically
2. All necessary tables will be initialized on first startup
3. If you need to migrate existing data, you can upload your local `database.db` file to Render

### 5. Updating the Production API URL

After deploying your backend, make sure your frontend uses the correct API URL:

In your Vercel dashboard, set the environment variable:
```
VITE_PROD_API_URL=https://your-render-app-url.onrender.com
```

Replace `https://your-render-app-url.onrender.com` with your actual Render deployment URL.

### 6. Verification Steps

After deployment:

1. Visit your frontend URL (Vercel domain)
2. Check that wallpapers load properly
3. Verify that the admin panel is accessible
4. Test adding/removing wallpapers through the admin panel
5. Confirm that the contact form works
6. Test the like button functionality
7. Verify the second phone number appears on the contact page

### 7. Troubleshooting

If the API doesn't work after deployment:
1. Check that your `VITE_PROD_API_URL` environment variable is correctly set
2. Verify that your backend API is running and accessible at the specified URL
3. Check browser console for CORS or network errors
4. Check backend logs on Render for any errors

## Adding Your Local Data

To migrate your existing data from the local database:
1. Access your deployed database file or use Render's database tools
2. Copy your local `database.db` file content to the production database
3. Or update through the admin panel

## Maintenance

- For backend updates, push changes to your repository - Render will auto-deploy
- For frontend updates, push changes to your repository - Vercel will auto-deploy
- Monitor your application logs regularly
- Back up your database regularly
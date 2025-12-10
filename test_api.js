// Simple script to test the API endpoint directly
import http from 'http';

const options = {
  hostname: 'localhost',
  port: 3013, // Your backend server port
  path: '/api/wallpapers?pageType=collections',
  method: 'GET',
};

console.log('Testing API endpoint: http://localhost:3013/api/wallpapers?pageType=collections');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log('Headers:', res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const wallpapers = JSON.parse(data);
      console.log(`Response: Found ${wallpapers.length} wallpapers`);
      
      // Find our specific wallpaper
      const wallpaper28 = wallpapers.find(wp => wp.id === 28);
      if (wallpaper28) {
        console.log('\nFound wallpaper ID 28 in API response:');
        console.log(`Name: ${wallpaper28.name}`);
        console.log(`PageType: ${wallpaper28.pageType}`);
        console.log(`ImageUrl: ${wallpaper28.imageUrl}`);
        console.log(`ThumbnailUrl: ${wallpaper28.thumbnailUrl}`);
        console.log(`MediumUrl: ${wallpaper28.mediumUrl}`);
      } else {
        console.log('\nWallpaper ID 28 not found in API response for collections pageType');
        console.log('All wallpaper IDs returned:', wallpapers.map(wp => wp.id));
      }
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('API request error:', e);
});

req.end();
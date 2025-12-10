// Simple script to test the API endpoint directly
async function testApi() {
  try {
    console.log('Testing API endpoint: http://localhost:3013/api/wallpapers?pageType=collections');
    
    const response = await fetch('http://localhost:3013/api/wallpapers?pageType=collections');
    console.log(`Status: ${response.status}`);
    
    const wallpapers = await response.json();
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
      console.log(`WebpUrl: ${wallpaper28.webpUrl}`);
    } else {
      console.log('\nWallpaper ID 28 not found in API response for collections pageType');
      console.log('All wallpaper IDs returned:', wallpapers.map(wp => wp.id));
    }
  } catch (error) {
    console.error('API request error:', error);
  }
}

testApi();
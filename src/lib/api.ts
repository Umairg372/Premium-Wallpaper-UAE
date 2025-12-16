import { getAuthToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface Wallpaper {
  id: number;
  name: string;
  category: string;
  color: string;
  pageType: 'collections' | 'kids' | '3d' | 'stickers' | 'colors' | 'videos';
  imagePath: string;
  imageUrl: string;
  thumbnailUrl?: string; // New: URL for the thumbnail image
  mediumUrl?: string; // New: URL for the medium-sized image
  webpUrl?: string; // New: URL for the WebP version
  width?: number; // New: Original image width
  height?: number; // New: Original image height
  videoPath?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WallpaperFormData {
  name: string;
  category: string;
  color: string;
  pageType: 'collections' | 'kids' | '3d' | 'stickers' | 'colors' | 'videos';
  image: File;
}



// Get headers with auth token if available
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  console.log('DEBUG: Token from getAuthToken():', token);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// GET all wallpapers
export async function getWallpapers(filters?: {
  pageType?: string;
  category?: string;
  color?: string;
}): Promise<Wallpaper[]> {
  const params = new URLSearchParams();
  if (filters?.pageType) params.append('pageType', filters.pageType);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.color) params.append('color', filters.color);

  const url = `${API_BASE_URL}/wallpapers${params.toString() ? '?' + params.toString() : ''}`;
  console.log('[API] Fetching wallpapers from:', url);

  try {
    const response = await fetch(url);
    console.log('[API] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Error response:', errorText);
      throw new Error(`Failed to fetch wallpapers: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[API] Received wallpapers:', data.length);
    return data;
  } catch (error) {
    console.error('[API] Network error fetching wallpapers:', error);

    // Fallback: Return some mock data for Vercel deployment
    console.warn('[API] Using fallback data for Vercel deployment');
    return [
      {
        id: 1,
        name: 'Modern Geometric',
        category: 'Modern',
        color: 'Blue',
        pageType: 'collections',
        imagePath: '/src/assets/collections/modern/geometric-pattern.jpg',
        imageUrl: '/src/assets/collections/modern/geometric-pattern.jpg',
        thumbnailUrl: '/src/assets/collections/modern/geometric-pattern.jpg',
        mediumUrl: '/src/assets/collections/modern/geometric-pattern.jpg',
        webpUrl: '/src/assets/collections/modern/geometric-pattern.jpg',
        width: 800,
        height: 1000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Classic Floral',
        category: 'Classic',
        color: 'Green',
        pageType: 'collections',
        imagePath: '/src/assets/collections/classic/floral-design.jpg',
        imageUrl: '/src/assets/collections/classic/floral-design.jpg',
        thumbnailUrl: '/src/assets/collections/classic/floral-design.jpg',
        mediumUrl: '/src/assets/collections/classic/floral-design.jpg',
        webpUrl: '/src/assets/collections/classic/floral-design.jpg',
        width: 800,
        height: 1000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'Kids Stars',
        category: 'Nursery',
        color: 'Yellow',
        pageType: 'kids',
        imagePath: '/src/assets/kids/nursery/stars-pattern.jpg',
        imageUrl: '/src/assets/kids/nursery/stars-pattern.jpg',
        thumbnailUrl: '/src/assets/kids/nursery/stars-pattern.jpg',
        mediumUrl: '/src/assets/kids/nursery/stars-pattern.jpg',
        webpUrl: '/src/assets/kids/nursery/stars-pattern.jpg',
        width: 800,
        height: 1000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }
}

// GET single wallpaper
export async function getWallpaper(id: number): Promise<Wallpaper> {
  try {
    const response = await fetch(`${API_BASE_URL}/wallpapers/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch wallpaper');
    }

    return response.json();
  } catch (error) {
    console.error('[API] Error fetching single wallpaper:', error);
    // Return mock data for Vercel deployment
    return {
      id: id,
      name: `Wallpaper ${id}`,
      category: 'Modern',
      color: 'Blue',
      pageType: 'collections',
      imagePath: '/src/assets/collections/modern/geometric-pattern.jpg',
      imageUrl: '/src/assets/collections/modern/geometric-pattern.jpg',
      thumbnailUrl: '/src/assets/collections/modern/geometric-pattern.jpg',
      mediumUrl: '/src/assets/collections/modern/geometric-pattern.jpg',
      webpUrl: '/src/assets/collections/modern/geometric-pattern.jpg',
      width: 800,
      height: 1000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

// POST new wallpaper
export async function createWallpaper(data: WallpaperFormData): Promise<Wallpaper> {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('category', data.category);
  formData.append('color', data.color);
  formData.append('pageType', data.pageType);
  formData.append('image', data.image);

  const token = getAuthToken();
  console.log('DEBUG: Token for createWallpaper:', token);
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/wallpapers/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create wallpaper');
  }

  return response.json();
}

// POST bulk wallpapers
export async function bulkCreateWallpaper(data: {
  pageType: string;
  category: string;
  color: string;
  images: File[];
}): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append('pageType', data.pageType);
  formData.append('category', data.category);
  formData.append('color', data.color);
  data.images.forEach(image => {
    formData.append('wallpapers', image);
  });

  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/wallpapers/bulk`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to bulk upload wallpapers');
  }

  return response.json();
}



// PUT update wallpaper
export async function updateWallpaper(
  id: number,
  data: Partial<Omit<WallpaperFormData, 'image'>>
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/wallpapers/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update wallpaper');
  }
}

// DELETE wallpaper
export async function deleteWallpaper(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/wallpapers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete wallpaper');
  }
}

// GET categories
export async function getCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/wallpapers/meta/categories`);

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  } catch (error) {
    console.error('[API] Error fetching categories:', error);
    // Return mock categories for Vercel deployment
    return ['Modern', 'Classic', 'Luxury', 'Nursery', 'Toddlers', '3D Geometric', '3D Nature'];
  }
}

// POST new video wallpaper
export async function createVideoWallpaper(data: { name: string; videoFile: File; pageType: string; category: string; color: string; }): Promise<Wallpaper> {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('pageType', data.pageType);
  formData.append('category', data.category);
  formData.append('color', data.color);
  formData.append('video', data.videoFile);

  const token = getAuthToken();
  console.log('DEBUG: Token for createVideoWallpaper:', token);
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/wallpapers/upload-video-wallpaper`, {
      method: 'POST',
      headers,
      body: formData,
    });
  } catch (error) {
    console.error('Network error when uploading video wallpaper:', error);
    throw new Error('Network error: Unable to connect to server. Make sure the backend server is running.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { error: errorText };
    }
    throw new Error(errorData.error || 'Failed to create video wallpaper');
  }

  return response.json();
}

// POST video to an existing wallpaper
export async function addVideoToWallpaper(id: number, data: { name: string; videoFile: File }): Promise<Wallpaper> {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('video', data.videoFile);

  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/wallpapers/${id}/video`, {
      method: 'POST',
      headers,
      body: formData,
    });
  } catch (error) {
    console.error('Network error when adding video to wallpaper:', error);
    throw new Error('Network error: Unable to connect to server. Make sure the backend server is running.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { error: errorText };
    }
    throw new Error(errorData.error || 'Failed to add video to wallpaper');
  }

  return response.json();
}

// Change admin password
export async function changeAdminPassword(newPassword: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/password/change`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ newPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to change password');
  }
}


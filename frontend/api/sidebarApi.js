import apiClient from './client';

export const fetchSidebarData = async () => {
  try {
    const response = await apiClient.get('/sidebar.php');
    
    if (!Array.isArray(response.data)) {
      throw new Error('Sidebar API returned invalid format');
    }

    return response.data;
  } catch (err) {
    console.error('[Sidebar API] Failed to

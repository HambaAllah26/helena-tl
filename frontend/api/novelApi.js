import apiClient from './client';

export const fetchNovelData = async (novelId) => {
  try {
    console.log('[API] Making request for novel:', novelId);
    const fullUrl = `${apiClient.defaults.baseURL}/novel.php?novel=${encodeURIComponent(novelId)}`;
    console.log('[API] Full request URL:', fullUrl);

    const response = await apiClient.get('/novel.php', {
      params: { novel: novelId }
    });
    
    console.log('[API] Response:', response);
    return response;
  } catch (error) {
    console.error('[API] Full error details:', {
      config: error.config,
      response: error.response,
      message: error.message
    });
    throw error;
  }
};
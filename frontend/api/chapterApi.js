import apiClient from './client';

export const fetchChapterData = async (novelId, chapterNumber) => {
  try {
    const response = await apiClient.get('/chapter.php', {
      params: {
        novel: novelId,
        number: chapterNumber
      }
    });
    
    if (!response.chapter || !response.adjacentChapters) {
      throw new Error('Invalid chapter data structure');
    }
    
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
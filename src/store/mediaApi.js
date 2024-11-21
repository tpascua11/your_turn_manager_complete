// mediaApi.js - API functions to fetch media
export const fetchMusic = async () => {
  try {
      const response = await fetch('https://api.github.com/repos/trpascua/mp3_storage_template/contents/');
      const data = await response.json();
      
      return data
          .filter(file => file.name.endsWith('.mp3'))
          .map(file => ({
              name: file.name.replace(/_/g, ' ').replace('.mp3', ''),
              url: file.download_url
          }));
  } catch (error) {
      console.error('Error fetching music:', error);
      return [];
  }
};

export const fetchImages = async () => {
  try {
      const response = await fetch('https://api.github.com/repos/trpascua/gallery_simple_template/contents/Character');
      const data = await response.json();
      
      return data
          .filter(file => file.name.endsWith('.jpg') || file.name.endsWith('.png'))
          .map(file => ({
              name: file.name,
              url: file.download_url
          }));
  } catch (error) {
      console.error('Error fetching images:', error);
      return [];
  }
};
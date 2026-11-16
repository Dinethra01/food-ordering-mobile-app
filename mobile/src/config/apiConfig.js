import { Platform } from 'react-native';

const getLocalBackendUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5001/api';
  }

  return 'http://localhost:5001/api';
};

export const API_BASE_URL = getLocalBackendUrl();
export const BASE_URL = API_BASE_URL.replace('/api', '');

export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/150';

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  return `${BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

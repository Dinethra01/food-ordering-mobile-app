import { Platform, NativeModules } from 'react-native';
import Constants from 'expo-constants';

// Set this to your deployed Render/Cloud URL if testing against live cloud backend,
// e.g.: export const DEPLOYED_BACKEND_URL = 'https://food-ordering-api.onrender.com/api';
// Or leave empty string '' to automatically connect to your local Node.js backend.
export const DEPLOYED_BACKEND_URL = '';

const getExpoHost = () => {
  // 1. Resolve host from NativeModules.SourceCode.scriptURL (works reliably on physical devices via Metro)
  const scriptURL = NativeModules.SourceCode?.scriptURL;
  if (scriptURL) {
    const match = scriptURL.match(/^https?:\/\/([^:\/]+)/);
    if (match && match[1] && match[1] !== 'localhost' && match[1] !== '127.0.0.1') {
      return match[1];
    }
  }

  // 2. Resolve host from Expo Constants
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost;

  if (!hostUri) return null;

  return hostUri.startsWith('[')
    ? hostUri.slice(1, hostUri.indexOf(']'))
    : hostUri.split(':')[0];
};

const getLocalBackendUrl = () => {
  if (DEPLOYED_BACKEND_URL && DEPLOYED_BACKEND_URL.trim() !== '') {
    return DEPLOYED_BACKEND_URL.trim();
  }

  // Physical phones connect directly to your Mac's LAN IP
  const expoHost = getExpoHost();
  if (expoHost && expoHost !== 'localhost' && expoHost !== '127.0.0.1') {
    const formattedHost = expoHost.includes(':') ? `[${expoHost}]` : expoHost;
    return `http://${formattedHost}:5001/api`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5001/api';
  }

  return 'http://localhost:5001/api';
};

export const API_BASE_URL = getLocalBackendUrl();
export const BASE_URL = API_BASE_URL.replace('/api', '');

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  return `${BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

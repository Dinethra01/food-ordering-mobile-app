import { Platform, NativeModules } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set this to your deployed Render/Cloud URL if testing against live cloud backend,
// e.g.: export const DEPLOYED_BACKEND_URL = 'https://food-ordering-api.onrender.com/api';
// Or leave empty string '' to use the local Node.js backend.
export const DEPLOYED_BACKEND_URL = '';

/**
 * Extracts host IP from React Native's NativeModules.SourceCode.scriptURL
 * When running in Expo Go on a physical phone, this is the exact IP the bundle was served from.
 */
const getHostFromScriptUrl = () => {
  try {
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    if (!scriptURL) return null;
    const match = scriptURL.match(/^https?:\/\/([^:/]+)/);
    if (match && match[1]) {
      const host = match[1];
      if (host !== 'localhost' && host !== '127.0.0.1') {
        return host;
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
};

/**
 * Extracts host IP from Expo Constants (hostUri or debuggerHost)
 */
const getExpoHost = () => {
  try {
    const hostUri =
      Constants.expoConfig?.hostUri ||
      Constants.manifest2?.extra?.expoClient?.hostUri ||
      Constants.manifest?.debuggerHost ||
      Constants.manifest?.bundleUrl;

    if (!hostUri) return null;

    const host = hostUri.startsWith('[')
      ? hostUri.slice(1, hostUri.indexOf(']'))
      : hostUri.split(':')[0];

    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return host;
    }
  } catch (e) {
    // ignore
  }
  return null;
};

export const getDefaultBackendUrl = () => {
  if (DEPLOYED_BACKEND_URL && DEPLOYED_BACKEND_URL.trim() !== '') {
    return DEPLOYED_BACKEND_URL.trim();
  }

  // 1. Try scriptURL (most reliable on physical phones running Expo Go)
  const scriptHost = getHostFromScriptUrl();
  if (scriptHost) {
    const formattedHost = scriptHost.includes(':') ? `[${scriptHost}]` : scriptHost;
    return `http://${formattedHost}:5001/api`;
  }

  // 2. Try Expo Constants hostUri
  const expoHost = getExpoHost();
  if (expoHost) {
    const formattedHost = expoHost.includes(':') ? `[${expoHost}]` : expoHost;
    return `http://${formattedHost}:5001/api`;
  }

  // 3. Fallback for Android Emulator
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5001/api';
  }

  // 4. Default fallback for iOS Simulator / Web
  return 'http://localhost:5001/api';
};

export let API_BASE_URL = getDefaultBackendUrl();
export let BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export const setStoredBackendUrl = async (url) => {
  if (!url || !url.trim()) {
    await AsyncStorage.removeItem('custom_backend_url');
    API_BASE_URL = getDefaultBackendUrl();
    BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
    return API_BASE_URL;
  }

  let formatted = url.trim();
  if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
    formatted = `http://${formatted}`;
  }
  if (!formatted.endsWith('/api') && !formatted.endsWith('/api/')) {
    formatted = `${formatted.replace(/\/$/, '')}/api`;
  }

  await AsyncStorage.setItem('custom_backend_url', formatted);
  API_BASE_URL = formatted;
  BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
  return formatted;
};

export const getStoredBackendUrl = async () => {
  const custom = await AsyncStorage.getItem('custom_backend_url');
  if (custom && custom.trim()) {
    API_BASE_URL = custom.trim();
    BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
    return custom.trim();
  }
  return getDefaultBackendUrl();
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  return `${BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

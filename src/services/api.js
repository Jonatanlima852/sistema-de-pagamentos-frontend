import axios from 'axios';
import { REACT_APP_API_URL } from '@env';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  // Se estiver no Expo Go
  if (Constants.appOwnership === 'expo') {
    return REACT_APP_API_URL;
  }
  return REACT_APP_API_URL || 'http://localhost:3000';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
});


export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}; 
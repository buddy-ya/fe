import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = Constants?.expoConfig?.extra?.BASE_URL || '';
console.log(BASE_URL);

export const API = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default API;

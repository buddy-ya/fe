import { API } from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEYS = {
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
} as const;

export const saveTokens = async (
  accessToken: string,
  refreshToken: string | null
) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
    API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    if (refreshToken) {
      await AsyncStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
    }
  } catch (error) {
    console.error("Error saving tokens:", error);
  }
};

export const getAccessToken = async () => {
  try {
    return API.defaults.headers.common['Authorization'] || AsyncStorage.getItem(TOKEN_KEYS.ACCESS);
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

export const getRefreshToken = async () => {
  try {
    return AsyncStorage.getItem(TOKEN_KEYS.REFRESH);
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

export const removeTokens = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEYS.ACCESS);
    await AsyncStorage.removeItem(TOKEN_KEYS.REFRESH);
    delete API.defaults.headers.common['Authorization'];
  } catch (error) {
    console.error("Error removing tokens:", error);
  }
};

export const isTokenPresent = async () => {
  try {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    return !!(accessToken && refreshToken);
  } catch (error) {
    console.error("Error checking tokens:", error);
    return false;
  }
};

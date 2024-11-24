import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_KEYS = {
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
} as const;

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await AsyncStorage.multiSet([
    [TOKEN_KEYS.ACCESS, accessToken],
    [TOKEN_KEYS.REFRESH, refreshToken],
  ]);
};

export const getAccessToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEYS.ACCESS);
};

export const getRefreshToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEYS.REFRESH);
};

export const isTokenPresent = async () => {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  return accessToken !== null && refreshToken !== null;
};

export const removeTokens = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEYS.ACCESS, TOKEN_KEYS.REFRESH]);
};

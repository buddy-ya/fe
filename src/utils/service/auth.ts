import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_KEYS = {
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
} as const;

export const saveTokens = async (
  accessToken: string,
  refreshToken: string | null
) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);

    if (refreshToken !== null) {
      await AsyncStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
    }
  } catch (error) {
    console.error("Error saving tokens:", error);
  }
};

export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEYS.ACCESS);
    return token;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

export const getRefreshToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEYS.REFRESH);
    return token;
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

export const isTokenPresent = async () => {
  try {
    const [accessToken, refreshToken] = await AsyncStorage.multiGet([
      TOKEN_KEYS.ACCESS,
      TOKEN_KEYS.REFRESH,
    ]);

    return (
      accessToken[1] != null &&
      accessToken[1] !== "" &&
      refreshToken[1] != null &&
      refreshToken[1] !== ""
    );
  } catch (error) {
    console.error("Error checking tokens:", error);
    return false;
  }
};

export const removeTokens = async () => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEYS.ACCESS, TOKEN_KEYS.REFRESH]);

    const [accessToken, refreshToken] = await AsyncStorage.multiGet([
      TOKEN_KEYS.ACCESS,
      TOKEN_KEYS.REFRESH,
    ]);

    if (accessToken[1] !== null || refreshToken[1] !== null) {
      await AsyncStorage.multiSet([
        [TOKEN_KEYS.ACCESS, ""],
        [TOKEN_KEYS.REFRESH, ""],
      ]);
    }

    const keys = await AsyncStorage.getAllKeys();
    const tokenKeys = keys.filter(
      (key) => key.includes("token") || key.includes("Token")
    );
    if (tokenKeys.length > 0) {
      await AsyncStorage.multiRemove(tokenKeys);
    }
  } catch (error) {
    console.error("Error removing tokens:", error);
  }
};

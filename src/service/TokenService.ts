import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEYS } from "../utils/constants";
import { API } from "@/api";

export const TokenService = {

    async getAccessToken() {
        return API.defaults.headers.common['Authorization'] || AsyncStorage.getItem(TOKEN_KEYS.ACCESS);
    },

    async getRefreshToken() {
        return AsyncStorage.getItem(TOKEN_KEYS.REFRESH);
    },

    async save(
        accessToken: string,
        refreshToken: string | null
    ) {
        await AsyncStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        if (refreshToken) {
            await AsyncStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
        }
    },

    async remove() {
        await AsyncStorage.removeItem(TOKEN_KEYS.ACCESS);
        await AsyncStorage.removeItem(TOKEN_KEYS.REFRESH);
        delete API.defaults.headers.common['Authorization'];
    },

    async isTokenPresent() {
        const accessToken = await this.getAccessToken();
        const refreshToken = await this.getRefreshToken();
        return !!(accessToken && refreshToken);
    },
}
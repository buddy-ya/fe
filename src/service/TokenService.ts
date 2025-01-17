import * as SecureStore from 'expo-secure-store';
import { TOKEN_KEYS } from "../utils/constants";
import { API } from "@/api";

export const TokenService = {

    async getAccessToken() {
        return API.defaults.headers.common['Authorization'] || SecureStore.getItemAsync(TOKEN_KEYS.ACCESS);
    },

    async getRefreshToken() {
        return SecureStore.getItemAsync(TOKEN_KEYS.REFRESH);
    },

    async save(
        accessToken: string,
        refreshToken: string | null
    ) {
        await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, accessToken);
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        if (refreshToken) {
            await SecureStore.setItemAsync(TOKEN_KEYS.REFRESH, refreshToken);
        }
    },

    async remove() {
        await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS);
        await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH);
        delete API.defaults.headers.common['Authorization'];
    },

    async isTokenPresent() {
        const accessToken = await this.getAccessToken();
        const refreshToken = await this.getRefreshToken();
        return !!(accessToken && refreshToken);
    },
}
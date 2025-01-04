import AuthRepository from "@/api/AuthRepository";
import { TOKEN } from "@/utils/constants/auth";
import { logError } from "@/utils/service/error";
import { processImageForUpload } from "@/utils/service/image";
import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthService {

  private accessToken: string | null;
  private refreshToken: string | null;

  async sendCodeByPhone(phoneNumber: string) {
    const { data } = await AuthRepository.sendCodeByPhone(phoneNumber);
    return data;
  };

  async verifyCodeByPhone(phoneNumber: string, code: string) {
    const { data } = await AuthRepository.verifyCodeByPhone(phoneNumber, code);
    return data;
  }

  async sendCodeByMail(requestBody) {
    const { data } = await AuthRepository.sendCodeByMail(requestBody);
    return data;
  };

  async verifyCodeByMail(requestBody) {
    const { data } = await AuthRepository.verifyCodeByMail(requestBody);
    return data;
  };

  async checkCertificated() {
    try {
      const { data } = await AuthRepository.checkCertificated();
      return data;
    } catch (error) {
      logError(error);
    }
  };

  async uploadStudentIdCard(image) {
    const formData = new FormData();
    formData.append("image", processImageForUpload(image));
    const { data } = await AuthRepository.uploadStudentIdCard(
      formData,
    );
    return data;
  };


  async saveTokens(
    accessToken: string,
    refreshToken: string | null
  ) {
    try {
      await AsyncStorage.setItem(TOKEN.ACCESS_TOKEN, accessToken);
      refreshToken && await AsyncStorage.setItem(TOKEN.REFRESH_TOKEN, refreshToken);
    } catch (error) {
      console.error("Error saving tokens:", error);
    }
  };

  async getAccessToken() {
    try {
      this.accessToken ??= await AsyncStorage.getItem(TOKEN.ACCESS_TOKEN);
      return this.accessToken;
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  };

  async getRefreshToken() {
    try {
      this.refreshToken ??= await AsyncStorage.getItem(TOKEN.REFRESH_TOKEN)
      return this.refreshToken;
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  };

  async removeTokens() {
    try {
      await AsyncStorage.removeItem(TOKEN.ACCESS_TOKEN);
      await AsyncStorage.removeItem(TOKEN.REFRESH_TOKEN);
      this.accessToken = null;
      this.refreshToken = null;
    } catch (error) {
      console.error("Error removing tokens:", error);
    }
  };

  async isTokenPresent() {
    try {
      const accessToken = await this.getAccessToken();
      const refreshToken = await this.getRefreshToken();
      return !!(accessToken && refreshToken);
    } catch (error) {
      console.error("Error checking tokens:", error);
      return false;
    }
  };
}

export default new AuthService();
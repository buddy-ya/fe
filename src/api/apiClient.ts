import i18n from '@/i18n';
import { resetToOnboarding } from '@/navigation/router';
import { BASE_URL } from '@env';
import axios from 'axios';
import { Alert } from 'react-native';
import { getAccessToken, getRefreshToken, removeTokens, saveTokens } from '@/utils/service/auth';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const reissueTokens = async (refreshToken: string) => {
  const response = await axios({
    method: 'post',
    url: `${BASE_URL}/auth/reissue`,
    data: { refreshToken },
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

const showErrorModal = (messageKey: string) => {
  Alert.alert(
    i18n.t('error:title'),
    i18n.t(`error:${messageKey}`),
    [{ text: i18n.t('common:confirm'), style: 'default' }],
    { cancelable: true }
  );
};

apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      showErrorModal('network');
      return Promise.reject(error);
    }

    const errorCode = error.response?.data?.code;

    if (error.response?.status === 401 && errorCode === 3002 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          throw new Error('Refresh token not found');
        }

        const { accessToken, refreshToken: newRefreshToken } = await reissueTokens(refreshToken);

        const finalRefreshToken = newRefreshToken || refreshToken;
        await saveTokens(accessToken, finalRefreshToken);
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(error.config);
      } catch (reissueError) {
        await removeTokens();
        resetToOnboarding();
        showErrorModal('tokenExpired');
        return Promise.reject(reissueError);
      }
    }

    // const serverErrorMessage = error.response.data?.message;
    // if (serverErrorMessage) {
    //   Alert.alert(
    //     i18n.t("error:title"),
    //     serverErrorMessage,
    //     [{ text: i18n.t("common:confirm"), style: "default" }],
    //     { cancelable: true }
    //   );
    //   return Promise.reject(error);
    // }

    // switch (error.response.status) {
    //   case 403:
    //     showErrorModal("forbidden");
    //     break;
    //   case 404:
    //     showErrorModal("notFound");
    //     break;
    //   case 500:
    //     showErrorModal("server");
    //     break;
    //   default:
    //     showErrorModal("default");
    // }
    return Promise.reject(error);
  }
);

export default apiClient;

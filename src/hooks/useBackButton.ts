import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastAndroid, BackHandler } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export const useBackButton = () => {
  const isFocused = useIsFocused();
  const [isToastVisible, setIsToastVisible] = useState(false);

  const { t } = useTranslation('toast');

  useEffect(() => {
    const backAction = () => {
      if (!isFocused) return;
      if (isToastVisible) {
        BackHandler.exitApp();
        return true; // 기본 뒤로 가기 액션을 막음
      } else {
        showToast();
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [isFocused, isToastVisible]);

  const showToast = () => {
    setIsToastVisible(true);
    ToastAndroid.showWithGravity(
      t('exit_confirm_message'),
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );

    setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
  };
};

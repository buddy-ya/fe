import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View, ScrollView } from 'react-native';
import {
  ErrorMessage,
  FooterLayout,
  Heading,
  HeadingDescription,
  InnerLayout,
  KeyboardLayout,
  Label,
  Layout,
  MyText,
} from '@/components';
import { useModalStore, useUserStore } from '@/store';
import Point from '@assets/icons/point.svg';
import { IdCardIcon } from 'lucide-react-native';
import EventRepository from '@/api/EventRepository';

export default function PointCouponScreen({ navigation }: any) {
  const { t } = useTranslation('mypage');
  const inputRef = useRef<TextInput>(null);
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const userUpdate = useUserStore((state) => state.update);
  const handleModalOpen = useModalStore((state) => state.handleOpen);

  const handleBack = () => {
    inputRef.current?.blur();
    navigation.goBack();
  };

  const handleApplyCoupon = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await EventRepository.applyCoupon(couponCode);
      userUpdate({ point: data.point });
      handleModalOpen('point', {
        usedPoint: data.pointChange,
        currentPoint: data.point,
        action: 'INCREASE',
      });
      setTimeout(() => navigation.goBack(), 1000);
    } catch (err: any) {
      const code = err.response?.data?.code;
      if (code === 12000) {
        setError(t('pointCouponScreen.errors.notFound'));
      } else if (code === 12001) {
        setError(t('pointCouponScreen.errors.alreadyUsed'));
      } else {
        setError(t('pointCouponScreen.errors.invalid'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const footer = (
    <FooterLayout
      icon={<></>}
      content={<></>}
      onPress={handleApplyCoupon}
      disabled={isLoading || couponCode.trim().length === 0}
      loading={isLoading}
    />
  );

  return (
    <Layout showHeader onBack={handleBack} isBackgroundWhite>
      <KeyboardLayout footer={footer}>
        <InnerLayout>
          <View className="flex-1">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Heading>{t('pointCouponScreen.title')}</Heading>
              <HeadingDescription>{t('pointCouponScreen.description')}</HeadingDescription>
              <Label>{t('pointCouponScreen.label')}</Label>
              <View className="mb-4">
                <TextInput
                  ref={inputRef}
                  value={couponCode}
                  onChangeText={setCouponCode}
                  placeholder={t('pointCouponScreen.placeholder')}
                  autoCapitalize="characters"
                  className="mb-4 h-[52px] w-[80%] rounded-xl border border-border px-[14px] text-[18px] text-text"
                  placeholderTextColor="#DFDFDF"
                  textAlignVertical="center"
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </View>
            </ScrollView>
          </View>
        </InnerLayout>
      </KeyboardLayout>
    </Layout>
  );
}

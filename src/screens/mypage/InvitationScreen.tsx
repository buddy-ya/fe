import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Text } from 'react-native';
import { UserRepository } from '@/api';
import { Layout, InnerLayout, MyText, Button, KeyboardLayout } from '@/components';
import { useModalStore, useToastStore, useUserStore } from '@/store';
import EventIcon from '@assets/icons/invitationEvent.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { Copy } from 'lucide-react-native';

export interface InvitationCodeDTO {
  code: string;
  participated: boolean;
  point?: number;
  pointChange?: number;
}

export default function InvitationScreen({ navigation }: NativeStackScreenProps<any>) {
  const [ownInviteCode, setOwnInviteCode] = useState<string>('M65VOS');
  const [inputCode, setInputCode] = useState<string>('');
  const { showToast } = useToastStore();
  const { t } = useTranslation('mypage');
  const userUpdate = useUserStore((state) => state.update);
  const handleModalOpen = useModalStore((state) => state.handleOpen);

  useEffect(() => {
    (async () => {
      try {
        const result = await UserRepository.getInvitationCode();
        setOwnInviteCode(result.code);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleCopyCode = useCallback(() => {
    Clipboard.setString(ownInviteCode);
    showToast(<Text>📋</Text>, t('event.invitation.toast.copySuccess'));
  }, [ownInviteCode, showToast, t]);

  const handleSubmitInputCode = useCallback(async () => {
    if (!inputCode.trim()) {
      return;
    }
    try {
      const data = await UserRepository.submitInvitaionCode({ code: inputCode });
      userUpdate({ point: data.point });
      handleModalOpen('point', {
        usedPoint: data.pointChange,
        currentPoint: data.point,
        action: 'INCREASE',
      });
      setInputCode('');
    } catch (error) {
      setInputCode('');
    }
  }, [inputCode, userUpdate, handleModalOpen]);

  const isSubmitDisabled = !inputCode.trim();

  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      headerCenter={
        <View className="flex-row items-center">
          <MyText size="text-lg" className="font-semibold" numberOfLines={1}>
            Event
          </MyText>
        </View>
      }
    >
      <KeyboardLayout>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <InnerLayout>
            <View className="flex-1 items-center">
              <View className="mt-14">
                <EventIcon />
              </View>
              <MyText size="text-lg" className="mt-6 text-center font-bold">
                {t('event.invitation.title')}
              </MyText>
              <MyText color="text-textDescription" className="mt-3 text-center">
                {t('event.invitation.subtitle')}
              </MyText>
              <TouchableOpacity
                onPress={handleCopyCode}
                className="mt-7 w-80 flex-row items-center justify-between rounded-[30px] border border-gray-300 bg-white px-9 py-[16px]"
              >
                <View className="flex-row items-center">
                  <MyText color="text-textDescription">
                    {t('event.invitation.inviteCodeLabel')}
                  </MyText>
                  <MyText size="text-lg" className="ml-3 font-semibold">
                    {ownInviteCode}
                  </MyText>
                </View>
                <Copy size={18} strokeWidth={1.3} color="#282828" />
              </TouchableOpacity>

              <View className="mt-12 w-full px-4">
                <MyText size="text-base" className="mb-4 font-medium">
                  {t('event.invitation.inputLabel')}
                </MyText>
                <View className="flex-row items-center rounded-xl border border-gray-300 bg-white px-4">
                  <TextInput
                    value={inputCode}
                    onChangeText={setInputCode}
                    placeholder={t('event.invitation.inputPlaceholder')}
                    className="h-[45px] flex-1"
                    autoCapitalize="characters"
                    style={{ textAlignVertical: 'center' }}
                  />
                  <TouchableOpacity
                    onPress={handleSubmitInputCode}
                    disabled={isSubmitDisabled}
                    className={`ml-2 rounded-lg px-3 py-2 ${
                      isSubmitDisabled ? 'bg-gray-400' : 'bg-primary'
                    }`}
                  >
                    <MyText size="text-sm" color="text-white">
                      {t('event.invitation.submitButton')}
                    </MyText>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="mt-20 max-w-[95%]">
                <MyText size="text-xs" color="text-gray-500" className="mb-[2px] text-center">
                  {t('event.invitation.notice1')}
                </MyText>
                <MyText size="text-xs" color="text-gray-500" className="mb-[2px] text-center">
                  {t('event.invitation.notice2')}
                </MyText>
                <MyText size="text-xs" color="text-gray-500" className="text-center">
                  {t('event.invitation.notice3')}
                </MyText>
              </View>
            </View>
          </InnerLayout>
        </ScrollView>
      </KeyboardLayout>
    </Layout>
  );
}

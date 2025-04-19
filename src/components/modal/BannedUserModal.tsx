import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback, BackHandler } from 'react-native';
import { MyText } from '@/components';
import { XCircle } from 'lucide-react-native';

interface BannedUserModalProps {
  visible: boolean;
  banExpiration?: string;
  banReason?: string;
}

export function BannedUserModal({ visible, banExpiration, banReason }: BannedUserModalProps) {
  const { t } = useTranslation('common');

  const formattedBanExpiration = banExpiration ? banExpiration.substring(0, 10) : '';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        activeOpacity={1}
        className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.4)]"
      >
        <TouchableWithoutFeedback>
          <View className="w-[85%] rounded-2xl bg-white p-8">
            <View className="mb-4 items-center">
              <XCircle size={28} color="black" />
            </View>
            <MyText size="text-lg" color="text-black" className="mb-3 text-center font-semibold">
              {t('modal.banned.title')}
            </MyText>
            <MyText
              size="text-base"
              color="text-textDescription"
              className="mb-1 text-center font-medium"
            >
              {t('modal.banned.reason')}
            </MyText>
            <View className="mt-2 rounded-xl">
              <MyText size="text-base" color="" className="text-center">
                {banReason}
              </MyText>
            </View>
            <MyText
              size="text-base"
              color="text-textDescription"
              className="mt-4 text-center font-medium"
            >
              {t('modal.banned.expiration')}
            </MyText>
            <View className="mt-2 rounded-xl">
              <MyText size="text-base" color="" className="text-center">
                {formattedBanExpiration}
              </MyText>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

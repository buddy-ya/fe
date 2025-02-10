import { useTranslation } from 'react-i18next';
import { Image, Modal, TouchableOpacity, View } from 'react-native';
import { API } from '@/api';
import { getCountryFlag } from '@/utils';
import MyText from '@/components/common/MyText';

interface CommonModalProps {
  visible: boolean;
  onClose: () => void;
  data: any;
}

export function ChatRequestModal({ visible, data, onClose }: CommonModalProps) {
  const { t } = useTranslation('feed');
  const name = data?.name;
  const university = data?.university;
  const country = data?.country;
  const isProfileImageUpload = data?.isProfileImageUpload;
  const profileImageUrl = data?.profileImageUrl;

  const title = t('chatRequestModal.title');
  const description = t('chatRequestModal.description');
  const confirmText = t('chatRequestModal.confirm');
  const cancelText = t('chatRequestModal.cancel');

  const onConfirm = async () => {
    const userId = data?.userId;
    await API.post(`/chat-requests/${userId}`);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={onClose}>
        <View className={`absolute bottom-0 w-full rounded-[12px] bg-white`}>
          <View className="p-5">
            <View className={''}>
              <MyText size="text-[20px]" className="font-semibold">
                {title}
              </MyText>
              <MyText size="text-[14px] mt-4" color="text-textDescription">
                {description}
              </MyText>
            </View>
            <View className="mt-6 rounded-[12px] bg-mainBackground py-4">
              <View className="items-center">
                <Image
                  className="h-[48px] w-[48px] rounded-[12px]"
                  source={{ uri: profileImageUrl }}
                />
                <MyText size="" className="mt-3 font-semibold leading-[1]">
                  {t(`profile.university.${university}`)}
                </MyText>
                <MyText size="" className="leading-normal">
                  {data?.name} {getCountryFlag(country)}
                </MyText>
                <MyText
                  size="text-sm"
                  className={`mt-3 rounded-full px-2 py-1 ${
                    isProfileImageUpload
                      ? 'bg-[#E8F8F4] text-primary'
                      : 'bg-black/10 text-textProfile'
                  }`}
                >
                  {isProfileImageUpload ? 'Photo verified' : 'Photo unverified'}
                </MyText>
              </View>
            </View>
            <View className="mb-2 mt-10 flex-row gap-2">
              <TouchableOpacity
                className="mr-3 flex-1 justify-center rounded-[12px] bg-[#DFDFDF] py-[12px]"
                onPress={onClose}
              >
                <MyText size="text-[16px]" className="text-center font-semibold text-white">
                  {cancelText}
                </MyText>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 justify-center rounded-[12px] bg-primary"
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
              >
                <MyText size="text-[16px]" className="text-center font-semibold text-white">
                  ♡ {confirmText}
                </MyText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

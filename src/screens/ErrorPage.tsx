import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Modal, TouchableOpacity, View } from 'react-native';
import { MyText } from '@/components';

export default function ErrorPage({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Modal visible transparent animationType="fade">
      <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1}>
        <View className="absolute left-5 right-5 top-1/2 -translate-y-1/2 rounded-[20px] bg-white">
          <View className="px-5 py-6">
            <View className="min-h-[180px]">
              <MyText size="text-2xl" className="font-semibold">
                {'UNKNOWN ERROR'}
              </MyText>
              <MyText size="text-[14px] mt-5" color="text-textDescription">
                An unknown error has occurred! 😱
              </MyText>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                className="flex-1 rounded-[12px] bg-primary py-[16px]"
                onPress={() => {
                  resetErrorBoundary();
                }}
              >
                <MyText size="text-[16px]" className="text-center font-semibold text-white">
                  {'OK'}
                </MyText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

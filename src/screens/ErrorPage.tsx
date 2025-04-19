import { MyText } from '@/components';
import { FallbackProps } from 'react-error-boundary';
import { Modal, TouchableOpacity, View } from 'react-native';


export default function ErrorPage({
    error,
    resetErrorBoundary
}: FallbackProps) {

    return (
        <Modal visible transparent animationType="fade">
            <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1}>
                <View className={`absolute left-5 right-5 rounded-[20px] bg-white top-1/2 -translate-y-1/2`}>
                    <View className="px-5 py-6">
                        <View className={'min-h-[180px]'}>
                            <MyText size="text-2xl" className="font-semibold">
                                {'에러가 발생했습니다.'}
                            </MyText>
                            <MyText size="text-[14px] mt-5" color="text-textDescription">
                                {'확인 버튼을 눌러주세요'}
                            </MyText>
                        </View>
                        <View className="flex-row">
                            <TouchableOpacity
                                className="flex-1 rounded-[12px] bg-primary py-[16px]"
                                onPress={() => {
                                    // TODO: 추후 추가 예정
                                    // onConfirm();
                                    resetErrorBoundary();
                                }}
                            >
                                <MyText size="text-[16px]" className="text-center font-semibold text-white">
                                    확인
                                </MyText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

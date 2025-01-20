import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Check, Search, X } from 'lucide-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CustomBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  options: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  title?: string;
  enableSearch?: boolean;
}

export default function CustomBottomSheet({
  isVisible,
  onClose,
  options,
  selectedValue,
  onSelect,
  title,
  enableSearch = false,
}: CustomBottomSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '70%'], []);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
    onClose();
    setSearchQuery('');
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={handleClose}
      />
    ),
    [handleClose]
  );

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((option) => option.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [options, searchQuery]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={handleClose}
      backdropComponent={renderBackdrop}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView className="flex-1">
        <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-4">
          {title && <Text className="font-bold text-lg">{title}</Text>}
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color="black" />
          </TouchableOpacity>
        </View>

        {enableSearch && (
          <View className="border-b border-borderSelect px-4 py-2">
            <View className="flex-row items-center rounded-xl border-borderBottom px-4 py-2">
              <Search size={20} color="gray" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="검색"
                className="ml-2 flex-1 text-base"
                autoCapitalize="none"
                clearButtonMode="while-editing"
              />
            </View>
          </View>
        )}

        <View className="flex-1">
          <BottomSheetScrollView>
            {filteredOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  dismissKeyboard();
                  onSelect(option);
                  handleClose();
                }}
                className={`flex-row items-center justify-between border-b border-borderBottom px-6 py-4 ${option === selectedValue ? 'bg-selectActive' : ''} `}
              >
                <Text className={`text-base ${option === selectedValue ? 'text-primary' : ''}`}>
                  {option}
                </Text>
                {option === selectedValue && <Check size={20} color="" />}
              </TouchableOpacity>
            ))}
          </BottomSheetScrollView>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

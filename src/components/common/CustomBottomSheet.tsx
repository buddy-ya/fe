import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { X, Check, Search } from "lucide-react-native";

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
  const [searchQuery, setSearchQuery] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "70%"], []);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
    onClose();
    setSearchQuery("");
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props) => (
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
    return options.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
        <View className="px-4 py-4 flex-row items-center justify-between border-b border-gray-200">
          {title && <Text className="text-lg font-bold">{title}</Text>}
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color="black" />
          </TouchableOpacity>
        </View>

        {enableSearch && (
          <View className="px-4 py-2 border-b border-gray-200">
            <View className="flex-row items-center px-4 py-2 bg-gray-100 rounded-xl">
              <Search size={20} color="gray" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="검색"
                className="flex-1 ml-2 text-base"
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
                className={`
                 flex-row items-center justify-between px-6 py-4 border-b border-gray-200
                 ${option === selectedValue ? "bg-green-50" : ""}
               `}
              >
                <Text
                  className={`text-base ${
                    option === selectedValue ? "text-primary" : ""
                  }`}
                >
                  {option}
                </Text>
                {option === selectedValue && (
                  <Check size={20} color="#34785B" />
                )}
              </TouchableOpacity>
            ))}
          </BottomSheetScrollView>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

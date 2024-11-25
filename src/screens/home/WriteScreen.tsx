import Layout from "@/components/common/Layout";
import { EllipsisVertical, Search } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
export default function WriteScreen({ navigation }) {
  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      headerRight={
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => {}}>
            <EllipsisVertical strokeWidth={2} size={24} color="#797977" />
          </TouchableOpacity>
        </View>
      }
    >
      <View></View>
    </Layout>
  );
}

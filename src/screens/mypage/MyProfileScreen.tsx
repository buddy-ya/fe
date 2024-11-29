import InnerLayout from "@/components/common/InnerLayout";
import Layout from "@/components/common/Layout";
import React from "react";
import { View, Text } from "react-native";

export default function MyProfileScreen({ navigation, route }) {
  const profile = route.params;
  console.log(profile);
  return (
    <Layout showHeader onBack={() => navigation.goBack()}>
      <InnerLayout>
        <View></View>
      </InnerLayout>
    </Layout>
  );
}

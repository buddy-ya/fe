import Layout from "@/components/common/Layout";
import React from "react";
import { View, Text } from "react-native";
import SejongLogo from "@assets/icons/universities/sejong.svg";
export default function UniversitySelectScreen() {
  return (
    <Layout>
      <SejongLogo width={24} height={24} />
      <Text>UniversitySelectScreen</Text>
    </Layout>
  );
}

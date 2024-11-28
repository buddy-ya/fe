import React from "react";
import { View, Text, Image } from "react-native";
export default function ImageScreen() {
  return (
    <View>
      {[1, 2, 3, 4, 5, 6].map((item) => {
        return (
          <Image
            source={require("@assets/images/profile/image1.png")}
            style={{
              width: 86,
              height: 86,
              borderWidth: 1,
              borderRadius: 12,
            }}
          />
        );
      })}
    </View>
  );
}

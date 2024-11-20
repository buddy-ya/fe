import React from "react";
import { Text } from "react-native";

interface MyTextProps {
  children: React.ReactNode;
  size?: string;
  color?: string;
  className?: string;
}

const MyText = ({
  children,
  size = "text-base",
  color = "text-[#282828]",
  className = "",
}: MyTextProps) => {
  return (
    <Text className={`${size} ${color} ${className} leading-[1.4]`}>
      {children}
    </Text>
  );
};

export default MyText;

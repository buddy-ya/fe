import React from 'react';
import { Text } from 'react-native';

interface MyTextProps {
  children: React.ReactNode;
  size?: string;
  color?: string;
  numberOfLines?: number;
  className?: string;
}

const MyText = ({
  children,
  size = 'text-base',
  color = 'text-[#282828]',
  numberOfLines,
  className = '',
}: MyTextProps) => {
  return (
    <Text
      className={`leading-[1.4] ${size} ${color} ${className} `}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
    >
      {children}
    </Text>
  );
};

export default MyText;

import React from 'react';
import { MyText } from '../common';

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export default function Heading({ children, className = '' }: HeadingProps) {
  return (
    <MyText
      size="text-[24px]"
      className={`mt-4 font-semibold ${className} leading-[1.4] tracking-wide`}
    >
      {children}
    </MyText>
  );
}

import React from 'react';
import MyText from '../common/MyText';

interface ErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

export default function ErrorMessage({ children, className }: ErrorMessageProps) {
  return (
    <MyText size="text-sm" color="text-textWarning" className={`mb-1 ${className}`}>
      {children}
    </MyText>
  );
}

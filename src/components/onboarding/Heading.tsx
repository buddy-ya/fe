import React from "react";
import MyText from "@/components/common/MyText";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export default function Heading({ children, className = "" }: HeadingProps) {
  return (
    <MyText
      size="text-[24px]"
      className={`font-semibold mt-4 ${className} tracking-wide leading-[1.4]`}
    >
      {children}
    </MyText>
  );
}

import React from "react";
import MyText from "../common/MyText";

interface HeadingDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export default function HeadingDescription({
  children,
  className = "",
}: HeadingDescriptionProps) {
  return (
    <MyText
      size="text-[14px]"
      color="text-textDescription"
      className={`mt-[9px] ${className} leading-[1.4]`}
    >
      {children}
    </MyText>
  );
}

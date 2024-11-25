import { ModalOption } from "@/screens/home/types";
import { useState } from "react";

export const useModal = () => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ModalOption[]>([]);

  const openModal = (newOptions: ModalOption[]) => {
    setOptions(newOptions);
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setOptions([]);
  };

  return {
    visible,
    options,
    openModal,
    closeModal,
  };
};

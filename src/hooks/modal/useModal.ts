import { useState } from 'react';

export const useModal = () => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);

  const openModal = (newOptions: any) => {
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

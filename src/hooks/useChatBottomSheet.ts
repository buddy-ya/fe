import { useState, useCallback, ReactNode } from 'react';

interface BottomSheetState {
    isOpen: boolean;
    content: ReactNode | null;
}

const useChatBottomSheet = () => {
    const [bottomSheetState, setBottomSheetState] = useState<BottomSheetState>({
        isOpen: false,
        content: null,
    });

    const openBottomSheet = useCallback((content: React.ReactNode) => {
        setBottomSheetState({
            isOpen: true,
            content,
        });
    }, []);

    const closeBottomSheet = useCallback(() => {
        setBottomSheetState({
            isOpen: false,
            content: null,
        });
    }, []);

    return {
        bottomSheetState,
        openBottomSheet,
        closeBottomSheet,
    };
};

export default useChatBottomSheet;
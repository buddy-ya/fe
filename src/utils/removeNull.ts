export const removeNullValues = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(removeNullValues).filter((item) => item !== null);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => {
        const cleanedValue = removeNullValues(value); // 재귀 호출
        if (cleanedValue !== null) {
          acc[key] = cleanedValue;
        }
        return acc;
      },
      {} as Record<string, any>
    );
  }
  return obj; // 기본값 반환
};

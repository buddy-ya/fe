export const logError = (error) => {
  if (error?.response?.data) {
    const apiError = error.response.data;
    console.log(`API 오류 [${apiError.code}]: ${apiError.message}`);
    return;
  }

  if (error instanceof Error) {
    console.log(`네트워크 오류: ${error.message}`);
    return;
  }

  console.log(`알 수 없는 오류가 발생했습니다`);
};

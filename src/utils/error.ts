export const logError = (error: any) => {
  if (error.config) {
    console.log(`API Error URL: ${error.config.url}`);
    console.log(`API Error Method: ${error.config.method}`);
    console.log(`API Error Status: ${error.response?.status}`);
    console.log(`API Error Message: ${error.response?.data?.message}`);
  }
  console.log("Error Stack:", error.stack);

  if (error.response?.data) {
    console.log(
      `API 오류 [${error.response.status}]: ${error.response.data.message}`
    );
  } else {
    console.log("Error:", error);
  }
};

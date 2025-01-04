import apiClient from "../apiClient";

// 인증/인가 관련 API를 다루는 클래스
class AuthRepository {

    async sendCodeByPhone(phoneNumber: string) {
        const { data } = await apiClient.post("/phone-auth/send-code", { phoneNumber });
        return data;
    };

    async verifyCodeByPhone(phoneNumber: string, code: string) {
        const { data } = await apiClient.post("/phone-auth/verify-code", { phoneNumber, code });
        return data;
    }

    async sendCodeByMail(requestBody) {
        const { data } = await apiClient.post("/certification/email/send", requestBody);
        return data;
    };

    async verifyCodeByMail(requestBody) {
        const { data } = await apiClient.post("/certification/email/verify-code", requestBody);
        return data;
    };

    async checkCertificated() {
        const { data } = await apiClient.get(`/certification`);
        return data;
    };

    async uploadStudentIdCard(formData: FormData) {
        const { data } = await apiClient.post(
            "/certification/student-id-card",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return data;
    };

}

export default new AuthRepository();
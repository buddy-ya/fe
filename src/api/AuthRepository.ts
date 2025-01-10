import { CheckCertificatedResponse, CommonResponse, SendCodeByMailDTO, SendCodeByPhoneDTO, VerifyCodeByMailDTO, VerifyCodeByPhoneDTO, VerifyCodeResponse } from "@/types/AuthDTO";
import API from "./API";

// 인증/인가 관련 API를 다루는 클래스
class AuthRepository {

    async sendCodeByPhone({ phoneNumber }: SendCodeByPhoneDTO): Promise<SendCodeByPhoneDTO> {
        const { data } = await API.post("/phone-auth/send-code", { phoneNumber });
        return data;
    };

    async verifyCodeByPhone({ phoneNumber, code }: VerifyCodeByPhoneDTO): Promise<VerifyCodeResponse> {
        const { data } = await API.post("/phone-auth/verify-code", { phoneNumber, code });
        return data;
    }

    async sendCodeByMail({ email, univName }: SendCodeByMailDTO): Promise<CommonResponse> {
        const { data } = await API.post("/certification/email/send", { email, univName });
        return data;
    };

    async verifyCodeByMail({ email, univName, code }: VerifyCodeByMailDTO): Promise<CommonResponse> {
        const { data } = await API.post("/certification/email/verify-code", { email, univName, code });
        return data;
    };

    async checkCertificated(): Promise<CheckCertificatedResponse> {
        const { data } = await API.get(`/certification`);
        return data;
    };

    async uploadStudentIdCard(formData: FormData): Promise<CommonResponse> {
        const { data } = await API.post(
            "/certification/student-id-card",
            formData,
            {
                headers: {
                    ...API.defaults.headers.common,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return data;
    };

    async refreshStudentCertification() {
        const { data } = await API.put(`/certification/refresh`);
        return data;
    };

}

export default new AuthRepository();
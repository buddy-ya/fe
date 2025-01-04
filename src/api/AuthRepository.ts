import { SendCodeByMailDTO, VerifyCodeByMailDTO } from "@/types/AuthDTO";
import API from "./API";
import { Auth } from "@/types";

// 인증/인가 관련 API를 다루는 클래스
class AuthRepository {

    async sendCodeByPhone({ phoneNumber }: Auth.SendCodeByPhoneDTO) {
        const { data } = await API.post("/phone-auth/send-code", { phoneNumber });
        return data;
    };

    async verifyCodeByPhone({ phoneNumber, code }: Auth.VerifyCodeByPhoneDTO) {
        const { data } = await API.post("/phone-auth/verify-code", { phoneNumber, code });
        return data;
    }

    async sendCodeByMail({ email, univName }: SendCodeByMailDTO) {
        const { data } = await API.post("/certification/email/send", { email, univName });
        return data;
    };

    async verifyCodeByMail({ email, univName, code }: VerifyCodeByMailDTO) {
        const { data } = await API.post("/certification/email/verify-code", { email, univName, code });
        return data;
    };

    async checkCertificated() {
        const { data } = await API.get(`/certification`);
        return data;
    };

    async uploadStudentIdCard(formData: FormData) {
        const { data } = await API.post(
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
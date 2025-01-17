interface PhoneDTO {
    phoneNumber: string;
}

interface EmailDTO {
    email: string;
    univName: string;
}

export interface CommonResponse {
    success: boolean;
}

export interface ErrorResponse {
    code: number;
    message: string;
}

// Request DTO
export interface SendCodeByPhoneDTO extends PhoneDTO { }

export interface VerifyCodeByPhoneDTO extends PhoneDTO {
    code: string;
}

export interface SendCodeByMailDTO extends EmailDTO { }

export interface VerifyCodeByMailDTO extends EmailDTO {
    code: string;
}

// Response DTO
export interface VerifyCodeResponse extends PhoneDTO {
    status: string
    accessToken: string,
    refreshToken: string;
}

export interface CheckCertificatedResponse {
    isCertificated: boolean,
    isStudentIdCardRequested: boolean
    isKorean: boolean
}
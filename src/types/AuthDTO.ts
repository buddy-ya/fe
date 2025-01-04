interface PhoneDTO {
    phoneNumber: string;
}

interface EmailDTO {
    email: string;
    univName: string;
}

export interface SendCodeByPhoneDTO extends PhoneDTO { }

export interface VerifyCodeByPhoneDTO extends PhoneDTO {
    code: string;
}

export interface SendCodeByMailDTO extends EmailDTO { }

export interface VerifyCodeByMailDTO extends EmailDTO {
    code: string;
}

interface BaseDTO {
    phoneNumber: string;
}

export interface SendCodeByPhoneDTO extends BaseDTO { }

export interface VerifyCodeByPhoneDTO extends BaseDTO {
    code: string;
}

// TODO: 작업 필요
export interface SendCodeByMailDTO extends BaseDTO { }

export interface VerifyCodeByMailDTO extends BaseDTO { }

export const formatPhone = {
  removeHyphen: (phone: string) => phone.replace(/[^0-9]/g, ""),
  addHyphen: (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{0,4})(\d{0,4})$/);
    return match ? match.slice(1).filter(Boolean).join("-") : phone;
  },
  validate: (phone: string) => {
    const phoneRegex = /^010\d{8}$/;
    return phoneRegex.test(phone);
  },
  checkPrefix: (phone: string) => phone.length > 2 && !phone.startsWith("010"),
};

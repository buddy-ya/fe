import API from "./API";
import { Onboarding } from "@/types";

class OnboardingRepository {
    async create(dto: Onboarding.createInfoDTO) {
        const { data } = await API.post("/onboarding", dto);
        return data;
    }
}

export default new OnboardingRepository();
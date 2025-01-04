import API from "./API";

class UserRepository {

    async get() {
        const { data } = await API.get(`/mypage`);
        return data;
    };

    async updateName(name: string) {
        const { data } = await API.patch(`/mypage/update/name`, { name });
        return data;
    };

    async updateLanguages(languages: string[]) {
        const { data } = await API.patch(`/mypage/update/languages`, { languages });
        return data;
    };

    async updateInterests(interests: string[]) {
        const { data } = await API.patch(`/mypage/update/interests`, { interests });
        return data;
    };

    async updateProfileImage(imageKey: string) {
        const { data } = await API.patch(
            `/mypage/update/profile-default-image?profileImageKey=${imageKey}`
        );
        return data;
    };
}

export default new UserRepository();
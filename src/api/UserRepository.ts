import API from "./API";

class UserRepository {

    async get() {
        const { data } = await API.get(`/users`);
        return data;
    };

    async update({ key, values }: { key: string, values: string[] }) {
        const { data } = await API.patch(`/users`, { key, values });
        return data;
    };

    async updateProfileImage(imageKey: string) {
        const { data } = await API.patch(
            `/users/update/profile-default-image?profileImageKey=${imageKey}`
        );
        return data;
    };

    async delete() {
        const { data } = await API.delete(`/users/delete`);
        return data;
    }
}

export default new UserRepository();
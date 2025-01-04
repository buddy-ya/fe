import apiClient from "./apiClient";
import { createFeedFormData, FeedFormData } from "@/utils/service/formData";

class FeedRepository {

    async get(feedId: number) {
        const { data } = await apiClient.get(`/feeds/${feedId}`);
        return data;
    };

    async getAll(params: {
        category: string;
        page?: number;
        size?: number;
    }) {
        const { data } = await apiClient.get("/feeds", { params });
        return data;
    };

    async create(feedData: FeedFormData) {
        const formData = createFeedFormData(feedData);
        const { data } = await apiClient.post("/feeds", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    };

    async update(feedId: number, feedData: FeedFormData) {
        const formData = createFeedFormData(feedData);

        return await apiClient.patch(`/feeds/${feedId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    };

    async deleteFeed(feedId: number) {
        return await apiClient.delete(`/feeds/${feedId}`);
    };


    async searchFeeds(params: {
        category: string;
        keyword: string;
        page?: number;
        size?: number;
    }) {
        const { data } = await apiClient.get("/feeds", { params });
        return data;
    };

    async getBookmarkedFeeds(params: {
        page?: number;
        size?: number;
    }) {
        const { data } = await apiClient.get("/mypage/bookmark", { params });
        return data;
    };

    async getMyPosts(params: { page?: number; size?: number }) {
        const { data } = await apiClient.get("/mypage/myfeed", { params });
        return data;
    };

    async toggleLike(feedId: number) {
        const { data } = await apiClient.put(`/feeds/${feedId}/like`);
        return data;
    };

    async toggleBookmark(feedId: number) {
        const { data } = await apiClient.put(`/feeds/${feedId}/bookmark`);
        return data;
    };
}

export default new FeedRepository();
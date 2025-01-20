import API from "./API";
import { Feed } from "@/types";
import { GetBookmarkedFeedsDTO } from "@/types/FeedDTO";
import { createFeedFormData } from "@/utils";

class FeedRepository {

    async get({ feedId }: Feed.GetDTO) {
        const { data } = await API.get(`/feeds/${feedId}`);
        return data;
    };

    async getAll({
        category,
        page,
        size,
    }: Feed.GetAllDTO) {
        const { data } = await API.get("/feeds", {
            params: {
                category, page, size
            }
        });
        return data;
    };

    async create(feedData: Feed.CreateDTO) {
        const formData = createFeedFormData(feedData);
        const { data } = await API.post("/feeds", formData, {
            headers: {
                ...API.defaults.headers.common,
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    };

    async update({ feedId, ...feedData }: Feed.UpdateDTO) {
        const formData = createFeedFormData(feedData);
        const { data } = await API.patch(`/feeds/${feedId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    };

    async delete({ feedId }: Feed.DeleteDTO) {
        const { data } = await API.delete(`/feeds/${feedId}`);
        return data;
    };

    async searchFeeds({
        category,
        keyword,
        page,
        size
    }: Feed.SearchFeedsDTO) {
        const { data } = await API.get("/feeds", {
            params: {
                category,
                keyword,
                page,
                size
            }
        });
        return data;
    };

    async getBookmarkedFeeds({
        page,
        size,
    }: GetBookmarkedFeedsDTO) {
        const { data } = await API.get("/mypage/bookmark", {
            params: {
                page,
                size
            }
        });
        return data;
    };

    async getMyPosts({ page, size }: Feed.GetMyPostsDTO) {
        const { data } = await API.get("/mypage/myfeed", {
            params: {
                page, size
            }
        });
        return data;
    };

    async toggleLike({ feedId }: Feed.ToggleDTO) {
        const { data } = await API.put(`/feeds/${feedId}/like`);
        return data;
    };

    async toggleBookmark({ feedId }: Feed.ToggleDTO) {
        const { data } = await API.put(`/feeds/${feedId}/bookmark`);
        return data;
    };
}

export default new FeedRepository();
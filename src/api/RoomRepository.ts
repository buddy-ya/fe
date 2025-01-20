import { RoomDTO, RoomResponseDTO } from "@/types/RoomDTO";
import API from "./API";


class RoomRepository {

    async get({ roomId }: RoomDTO): Promise<RoomResponseDTO> {
        const { data } = await API.get(`/chatrooms/${roomId}`);
        return data;
    };

    async getRoomList(): Promise<RoomResponseDTO[]> {
        const { data } = await API.get(`/chatrooms`);
        return data;
    }

}

export default new RoomRepository();
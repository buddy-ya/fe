export interface Message {
    id: number; // 메시지 고유 ID
    sender: string; // 보낸 사람 (상대방 or 나)
    content: string; // 메시지 내용
}

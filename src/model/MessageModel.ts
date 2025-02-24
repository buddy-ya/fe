export interface Message {
  id: number; // 메시지 고유 ID
  sender: string; // 보낸 사람 (상대방 or 나)
  content: string; // 텍스트 메시지이거나 이미지 URL
  type: 'TALK' | 'IMAGE'; // 메시지 유형
  createdDate: string; // 메시지 생성 시각 (ISO 문자열 등)
}

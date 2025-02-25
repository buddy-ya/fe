export interface MessageRequest {
  type: 'TALK' | 'IMAGE';
  roomId: number;
  tempId: number;
  message: string;
}

export interface MessageResponse {
  id: number;
  roomId: number;
  type: 'TALK' | 'IMAGE';
  senderId: number;
  message: string;
  tempId: number;
  createdDate: string;
}

// UI에서 사용하는 최종 메시지 타입
export interface Message {
  id: number;
  sender: string;
  content: string;
  type: 'TALK' | 'IMAGE';
  createdDate: string;
}

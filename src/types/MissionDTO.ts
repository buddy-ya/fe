export interface MissionStatusResponseDTO {
  hasCertificated: boolean;
  todayAttended: boolean;
  totalMissionPoint: number;
}

export interface MissionAttendanceResponseDTO {
  point: number;
  pointChange: number;
  todayAttended: boolean;
  totalMissionPoint: number;
}

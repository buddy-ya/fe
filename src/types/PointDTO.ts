export interface PointDTO {
  id: number;
  pointType: 'signup' | 'match_request' | 'cancel_match_request' | string;
  pointChangeType: 'earn' | 'deduct' | 'mission' | string;
  pointChange: number;
  createdDate: string;
}

export interface PointsResponseDTO {
  points: PointDTO[];
  currentPoint: number;
}

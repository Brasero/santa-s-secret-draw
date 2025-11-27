export interface Participant {
  id: string;
  name: string;
}

export interface Couple {
  person1Id: string;
  person2Id: string;
}

export interface Draw {
  id: string;
  code: string;
  organizerName: string;
  drawName: string;
  participants: Participant[];
  couples: Couple[];
  assignments: Record<string, string>; // giverId -> receiverId
  createdAt: string;
}

export interface DrawResult {
  giverName: string;
  receiverName: string;
}

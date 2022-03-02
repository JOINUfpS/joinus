import {v4 as uuid} from 'uuid';

export interface CommunityUserMembers {
  id: uuid;
  userName: string;
  userDegree: any;
  userPhoto: uuid;
  isMember: boolean;
}

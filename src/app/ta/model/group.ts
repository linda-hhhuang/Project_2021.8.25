import { Student, Teacher } from './member';

export interface GroupList {
  [index: string]: number;
  gid: number;
}

export interface GroupMember {
  [index: string]: number | Teacher[] | Student[];
  gid: number;
  Teachers: Teacher[];
  Students: Student[];
}

export interface AutoGroupSuccessList {
  [index: string]: number | Student;
  student: Student;
  dispatchTarget: number;
}

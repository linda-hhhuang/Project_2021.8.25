import { NzUploadFile } from 'ng-zorro-antd/upload';

export interface SignTemplate {
  [index: string]: number | null | string | undefined | boolean;
  uid: number;
  name: string; // 姓名
  sex: string; // 性别
  birth: string; // 出生年月
  nation: string; // 民族
  politic: string; // 政治面貌
  sid: string; // 学号
  birthPlace: string; // 籍贯
  id: string; // 身份证号码
  university: string; // 本科院校
  department: string; // 本科院系
  major: string; // 本科专业
  enrollmentTime: string; // 入学时间
  phone: string; // 电话
  email: string; // 邮箱
  address: string; // 家庭住址
  emergencyPhone: string; // 紧急电话
  examFree: boolean | null; // 是否获取免试生资格（null为未确定）
  description: string; // 300字以内个人介绍
  reward: string; // 奖励与荣誉
  achievements: string; // 已取得的科研成果
  score: string; // 本科成绩及排名
  englishScore: string; // 外语成绩
  photo: string; // 证件照片
  sign: string; // 签名
  date: string; // 日期
}
export interface StudentStatus {
  [index: string]: number | null | boolean;
  score1: number; // 初评分分数
  pass1: boolean; // 第一轮通过情况
  score2: number; // 夏令营成绩
  status: number; // 材料审核状态
  // Wait 0 材料待审核
  // Pass 1 材料被审核过的意思
  // Validate 2
  // Checked 3 学生确定夏令营成绩
}

export type FileList = {
  [index: string]: number | string | NzUploadFile;
  fid: string;
  filename: string;
  studentUid: number;
  date: string;
  nzUpload: NzUploadFile;
};

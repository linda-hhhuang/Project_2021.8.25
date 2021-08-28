import { SignTemplate } from './request';

export interface Student {
  [index: string]: number | string | boolean | SignTemplate;
  uid: number; // 账号
  name: string; // 姓名
  score1: number; // 初评分分数
  pass1: boolean; // 第一轮通过情况
  score2: number; // 夏令营成绩
  status: number; // 材料审核状态
  // Wait 0 材料待审核
  // Pass 1 材料被审核过的意思
  // Validate 2
  // Checked 3 学生确定夏令营成绩
  groupGid: number; // 组号
  sign: string; // 签名
  SignupTemplate: SignTemplate;
}

export interface Teacher {
  [index: string]: number | string;
  uid: number; // 账号
  name: string; // 姓名
  phone: string; // 联系电话
  groupGid: number; // 组号
}

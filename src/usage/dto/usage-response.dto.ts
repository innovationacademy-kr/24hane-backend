import InOut from 'src/enums/inout.enum';

export class UsageResponseDto {
  userId: string; // 인트라 아이디
  profile: string; // 인트라 이미지
  state: InOut; // 상태
  //lastCheckInAt: Date; // 마지막 입실 시간
  durationTime: number; // 누적 시간
  fromDate: Date; // 누적 시간의 기준이 되는 시작 시간
  toDate: Date; // 누적 시간의 기준이 되는 끝 시간
}

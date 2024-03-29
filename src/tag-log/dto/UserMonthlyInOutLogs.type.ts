import { ApiProperty } from '@nestjs/swagger';
import { InOutLogType } from './subType/InOutLog.type';

export class UserMonthlyInOutLogsType {
  @ApiProperty({
    description: '42 로그인 ID',
    example: 'wchae',
  })
  login: string;

  @ApiProperty({
    description: '인트라 이미지 URI',
    example: 'https://cdn.intra.42.fr/users/wchae.jpg',
  })
  profileImage: string;

  @ApiProperty({
    description: '입실 - 퇴실 정보 배열',
    type: [InOutLogType],
  })
  inOutLogs: InOutLogType[];

  @ApiProperty({
    description: '월별 누적시간',
    example: 12345,
  })
  totalAccumulationTime: number | null = null;

  @ApiProperty({
    description: '월별 인정 누적시간',
    example: 12345,
  })
  acceptedAccumulationTime: number | null = null;
}

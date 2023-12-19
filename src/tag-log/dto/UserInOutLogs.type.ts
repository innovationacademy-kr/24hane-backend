import { ApiProperty } from '@nestjs/swagger';
import { InOutLogType } from './subType/InOutLog.type';

export class UserInOutLogsType {
  @ApiProperty({
    description: '42 로그인 ID',
    example: 'joopark',
  })
  login: string;

  @ApiProperty({
    description: '인트라 이미지 URI',
    example: 'https://cdn.intra.42.fr/users/joopark.jpg',
  })
  profileImage: string;

  @ApiProperty({
    description: '입실 - 퇴실 정보 배열',
    type: [InOutLogType],
  })
  inOutLogs: InOutLogType[];
}

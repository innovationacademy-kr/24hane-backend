import { ApiProperty } from '@nestjs/swagger';

export class RequestType {
  @ApiProperty({
    description: '42 로그인 ID',
    example: 'joopark',
  })
  login: string;

  @ApiProperty({
    description: '카드 재발급 신청 날짜/시간',
    example: '2042-04-02 04:02:42',
  })
  requested_at: Date;
}

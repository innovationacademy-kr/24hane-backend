import { ApiProperty } from '@nestjs/swagger';

export class ReissueRequestType {
  @ApiProperty({
    description: '42 로그인 ID',
    example: 'joopark',
  })
  login: string;

  @ApiProperty({
    description: '기존 카드번호',
    example: '1234567890123',
  })
  initial_card_no: string;

  @ApiProperty({
    description: '카드 재발급 신청 날짜/시간',
    example: '2042-04-02 04:02:42',
  })
  requested_at: Date;
}

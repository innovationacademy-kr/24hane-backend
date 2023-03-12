import { ApiProperty } from '@nestjs/swagger';

export class FinishedType {
  @ApiProperty({
    description: '42 로그인 ID',
    example: 'joopark',
  })
  login: string;

  @ApiProperty({
    description: '재발급 카드 수령 날짜/시간',
    example: '2042-04-02 04:02:42',
  })
  picked_up_at: Date;
}

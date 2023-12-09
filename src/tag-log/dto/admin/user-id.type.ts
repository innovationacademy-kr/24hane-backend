import { ApiProperty } from '@nestjs/swagger';

export class UserIdType {
  @ApiProperty({
    description: '42 계정 고유 ID',
    example: 12345,
  })
  id: number;

  @ApiProperty({
    description: '42 로그인 ID',
    example: 'joopark',
  })
  login: string;
}

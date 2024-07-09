import { ApiProperty } from '@nestjs/swagger';

export class IdLoginDto {
  @ApiProperty({
    description: '42 고유 ID',
    example: 1234,
  })
  user_id: number;

  @ApiProperty({
    description: '42 로그인 ID',
    example: 'joopark',
  })
  login: string;

  @ApiProperty({
    description: '관리자 여부',
    example: true,
  })
  is_admin: boolean;
}

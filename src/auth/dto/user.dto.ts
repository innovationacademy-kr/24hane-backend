import { ApiProperty } from '@nestjs/swagger';

/**
 * 유저의 기본적인 정보를 저장
 */
export class UserDto {
  @ApiProperty({
    description: '42 고유 ID',
    example: 12345,
  })
  user_id: number; // 42 고유 ID

  @ApiProperty({
    description: '42 로그인 ID',
    example: 'joopark',
  })
  login: string; // 42 로그인 ID

  @ApiProperty({
    description: 'staff 여부',
    example: false,
  })
  is_staff: boolean; // staff 여부
}

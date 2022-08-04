import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import InOut from 'src/enums/inout.enum';

export class UserInfoType {
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
    description: '42 관리자 여부',
    example: false,
  })
  isAdmin: boolean;

  @ApiPropertyOptional({
    description: '개포 체류인원 (Optional)',
    example: 42,
  })
  gaepo?: number;

  @ApiPropertyOptional({
    description: '서초 체류인원 (Optional)',
    example: 42,
  })
  seocho?: number;

  @ApiProperty({
    description: '본인의 클러스터 체류 여부',
    enum: ['IN', 'OUT'],
    example: 'OUT',
  })
  inoutState: InOut;
}

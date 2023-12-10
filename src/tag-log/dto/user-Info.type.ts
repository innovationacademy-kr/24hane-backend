import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import InOut from 'src/enums/inout.enum';
import { InfoMessageDto } from './info-message.dto';

/**
 * @version 4: login, profileImage, isAdmin, gaepo, seocho, inoutState, tagAt
 * @version 5: login, profileImage, isAdmin, gaepo, infoMessages, inoutState, tagAt
 */
export class UserInfoType {
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
    description: '안내 메세지(Optional)',
    example: [
      "fundInfoNotice", {
          title: '제목',
          content: '메세지',
      },
      "tagLatencyNotice",
      {
        title: '제목',
        content: '메세지',
      },
    ],
  })
  infoMessages?: Record<string, InfoMessageDto>;

  @ApiProperty({
    description: '본인의 클러스터 체류 여부',
    enum: ['IN', 'OUT'],
    example: 'OUT',
  })
  inoutState: InOut;

  @ApiProperty({
    description: '가장 최근에 태깅한 기록 (태깅한 기록이 없다면 null)',
    example: null,
  })
  tagAt: Date;
}

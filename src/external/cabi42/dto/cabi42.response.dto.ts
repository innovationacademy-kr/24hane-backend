import { ApiProperty } from '@nestjs/swagger';
import { UserIdType } from 'src/tag-log/dto/admin/user-id.type';

export class Cabi42ResponseDto extends UserIdType {
  @ApiProperty({
    description: '월별 누적시간 (초 단위)',
    example: 12345,
  })
  monthAccumationTime: number;
}

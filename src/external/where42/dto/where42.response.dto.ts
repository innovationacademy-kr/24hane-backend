import { ApiProperty } from '@nestjs/swagger';
import InOut from 'src/enums/inout.enum';

export class Where42ResponseDto {
  @ApiProperty({
    description: '42 로그인 ID',
    example: 'joopark',
  })
  login: string;

  @ApiProperty({
    description: '클러스터 체류 여부, bocal은 null',
    enum: InOut,
    example: InOut.OUT,
  })
  inoutState: InOut | null;
}

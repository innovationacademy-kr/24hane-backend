import { ApiProperty } from '@nestjs/swagger';

export class CardDto {
  @ApiProperty({
    description: '카드 고유 ID',
    example: '8201199000000',
  })
  card_id: string;

  @ApiProperty({
    description: '카드 발급일',
    example: new Date(),
  })
  begin: Date;

  @ApiProperty({
    description: '카드 만료일',
    example: new Date(),
  })
  end: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import ReissueState from 'src/enums/reissue-state.enum';

export class StateType {
  @ApiProperty({
    description: '카드 재발급 현황',
    example: `{state: ${ReissueState.IN_PROGRESS}}`,
  })
  state: ReissueState;
}

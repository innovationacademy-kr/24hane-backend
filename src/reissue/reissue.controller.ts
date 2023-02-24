import {
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserAuthGuard } from 'src/auth/guard/user-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserSessionDto } from '../auth/dto/user.session.dto';
import { CardReissueType } from './dto/reissue.type';
import { ReissueService } from './reissue.service';

@ApiTags('카드 재발급 관련')
@Controller({
  version: '1',
  path: 'reissue',
})
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
export class ReissueController {
  constructor(private reissueService: ReissueService) {}

  @Get()
  @ApiOperation({
    summary: '카드 재발급 신청 현황 조회',
    description: '사용자의 카드 재발급 신청 중 가장 최신 신청 건에 대한 신청 현황을 조회합니다.'
  })
  @ApiResponse({
    status: 200,
    type: CardReissueType,
    description: '조회 성공'
  })
  async getReissueState(@User() user: UserSessionDto): Promise<string> {
    const result = await this.reissueService.getReissueState(user.user_id);
    return result;
  }
  @Post('request')
  @ApiOperation({
    summary: '카드 재발급 신청',
    description: '카드 재발급 신청'
  })
  @ApiResponse({
    status: 200,
    type: CardReissueType,
    description: '신청 성공'
  })
  async reissueRequest(@User() user: UserSessionDto): Promise<void> {
    const result = await this.reissueService.reissueRequest(user);
    console.log(result);
  }
}

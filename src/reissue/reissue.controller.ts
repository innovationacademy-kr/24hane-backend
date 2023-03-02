import { Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserAuthGuard } from 'src/auth/guard/user-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserSessionDto } from '../auth/dto/user.session.dto';
import { reissueFinishedDto } from './dto/reissueFinished.dto';
import { reissueRequestDto } from './dto/reissueRequest.dto';
import { ReissueRequestType } from './dto/reissueRequest.type';
import { reissueSateDto } from './dto/reissueState.dto';
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
    description:
      '사용자의 카드 재발급 신청 중 가장 최신 신청 건에 대한 신청 현황을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    content: {
      'application/json': {
        examples: {
          '신청내역 없음': {
            value: { state: 'none' },
            description: '카드 재발급 신청내역 없음',
          },
          신청: {
            value: { state: 'apply' },
            description: '카드 재발급 신청',
          },
          카드제작중: {
            value: { state: 'in_progress' },
            description: '카드 재발급 신청 확인 후 제작 진행중인 상태',
          },
          제작완료: {
            value: { state: 'pick_up_requested' },
            description:
              '인포에서 재발급 카드 수령 후, 권한 부여, 24hane에 반영까지 완료된 상태',
          },
          수령완료: {
            value: { state: 'done' },
            description: '사용자가 수령완료한 상태',
          },
        },
      },
    },
  })
  async getReissueState(@User() user: UserSessionDto): Promise<reissueSateDto> {
    const result = await this.reissueService.getReissueState(user.user_id);
    return result;
  }

  @Post('request')
  @ApiOperation({
    summary: '카드 재발급 신청',
    description: '사용자의 카드 재발급 신청을 요청합니다.',
  })
  @ApiResponse({
    status: 201,
    type: ReissueRequestType,
    description: '신청 성공',
  })
  @ApiResponse({ status: 404, description: '사용자의 기존 카드번호 없음' })
  @ApiResponse({ status: 503, description: '구글스프레드시트/잔디알림 실패' })
  async reissueRequest(
    @User() user: UserSessionDto,
  ): Promise<reissueRequestDto> {
    const result = await this.reissueService.reissueRequest(user);
    return result;
  }

  @Patch('finish')
  @ApiOperation({
    summary: '재발급 카드 수령 완료',
    description: '사용자의 카드 재발급 신청 상태를 수령완료/완료로 변경합니다.',
  })
  @ApiResponse({
    status: 200,
    type: ReissueRequestType,
    description: '카드 재발급 신청 상태 수령완료로 변경',
  })
  @ApiResponse({
    status: 404,
    description: '사용자의 카드 재발급 신청내역 없음',
  })
  @ApiResponse({ status: 503, description: '구글스프레드시트/잔디알림 실패' })
  async patchReissueState(
    @User() user: UserSessionDto,
  ): Promise<reissueFinishedDto> {
    const result = await this.reissueService.patchReissueState(user);
    return result;
  }
}

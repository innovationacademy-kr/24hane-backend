import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Redirect,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RedirectService } from './redirect.service';

@ApiTags('고정 링크 리다이렉트용')
@Controller('redirect')
export class RedirectController {
  private logger = new Logger(RedirectController.name);

  constructor(private redirectService: RedirectService) {}

  /**
   * 지원금 지침 안내 페이지로 리다이렉트 합니다.
   */
  @ApiOperation({
    summary: '지원금 지침 안내 페이지',
    description: '.env의 URI_MONEY_GUIDELINE으로 리다이렉트합니다.',
  })
  @ApiResponse({
    status: 302,
    description: '리다이렉트 성공',
  })
  @ApiResponse({ status: 404, description: '리다이렉트할 페이지 없음' })
  @Get('money_guidelines')
  @Redirect()
  async moneyGuidelines() {
    const url = await this.redirectService.moneyGuidelines();
    if (!url) {
      throw new NotFoundException();
    }
    return { url };
  }

  /**
   * 출입기록 문의 페이지로 리다이렉트 합니다.
   */
  @ApiOperation({
    summary: '출입기록 문의 페이지',
    description: '.env의 URI_QUESTION으로 리다이렉트합니다.',
  })
  @ApiResponse({
    status: 302,
    description: '리다이렉트 성공',
  })
  @ApiResponse({ status: 404, description: '리다이렉트할 페이지 없음' })
  @Get('question')
  @Redirect()
  async question() {
    const url = await this.redirectService.question();
    if (!url) {
      throw new NotFoundException();
    }
    return { url };
  }

  /**
   * 이용 가이드 안내 페이지로 리다이렉트 합니다.
   */
  @ApiOperation({
    summary: '이용 가이드 지침 안내 페이지',
    description: '.env의 URI_USAGE으로 리다이렉트합니다.',
  })
  @ApiResponse({
    status: 302,
    description: '리다이렉트 성공',
  })
  @ApiResponse({ status: 404, description: '리다이렉트할 페이지 없음' })
  @Get('usage')
  @Redirect()
  async usage() {
    const url = await this.redirectService.usage();
    if (!url) {
      throw new NotFoundException();
    }
    return { url };
  }

  /**
   * 피드백 안내 페이지로 리다이렉트 합니다.
   */
  @ApiOperation({
    summary: '피드백 안내 페이지',
    description: '.env의 URI_FEEDBACK으로 리다이렉트합니다.',
  })
  @ApiResponse({
    status: 302,
    description: '리다이렉트 성공',
  })
  @ApiResponse({ status: 404, description: '리다이렉트할 페이지 없음' })
  @Get('feedback')
  @Redirect()
  async feedback() {
    const url = await this.redirectService.feedback();
    if (!url) {
      throw new NotFoundException();
    }
    return { url };
  }
}

import {
  Controller,
  Get,
  Logger,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckLogin } from 'src/auth/guard/check-login.guard';
import { User } from 'src/auth/user.decorator';
import { UsageResponseDto } from './dto/usage-response.dto';
import { UsageService } from './usage.service';

@ApiTags('체류 시간 산출')
@Controller({
  version: '3',
  path: 'usage',
})
export class UsageController {
  private logger = new Logger(UsageController.name);

  constructor(private usageService: UsageService) {}

  /**
   * 특정 일에 대해 체류했던 시간을 조회합니다.
   *
   * @param user 로그인한 사용자 세션
   * @returns UsageResponseDto
   */
  @ApiOperation({
    summary: '일별 체류시간 조회',
    description: '일별 체류시간을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: UsageResponseDto,
    description: '조회 성공',
  })
  @ApiResponse({ status: 401, description: '접근 권한 없음' })
  @Get('perday')
  @UseGuards(CheckLogin)
  async getPerDay(
    @User(new ValidationPipe({ validateCustomDecorators: true })) user: any,
  ): Promise<UsageResponseDto> {
    this.logger.debug(`call getPerDay request by ${user.login}`);
    const userId = user.login + 'asdf';
    const date = new Date();
    const perday = await this.usageService.getPerDay(userId, date);
    const latest = await this.usageService.getLatestDataById(userId);
    const latestIn = await this.usageService.getLatestInById(userId);
    return {
      userId: user.login,
      profile: user.image_url,
      state: latest ? latest.inout : null,
      lastCheckInAt: latestIn ? latestIn.timestamp : null,
      ...perday,
    };
  }

  /**
   * 특정 주에 대해 체류했던 시간을 조회합니다.
   *
   * @param user 로그인한 사용자 세션
   * @returns UsageResponseDto
   */
  @ApiOperation({
    summary: '주별 체류시간 조회',
    description: '주별 체류시간을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: UsageResponseDto,
    description: '조회 성공',
  })
  @ApiResponse({ status: 401, description: '접근 권한 없음' })
  @Get('perweek')
  @UseGuards(CheckLogin)
  async getPerWeek(
    @User(new ValidationPipe({ validateCustomDecorators: true })) user: any,
  ): Promise<UsageResponseDto> {
    this.logger.debug(`call getPerWeek request by ${user.login}`);
    const userId = user.login;
    const date = new Date();
    const perweek = await this.usageService.getPerWeek(userId, date);
    const latest = await this.usageService.getLatestDataById(userId);
    const latestIn = await this.usageService.getLatestInById(userId);
    return {
      userId: user.login,
      profile: user.image_url,
      state: latest ? latest.inout : null,
      lastCheckInAt: latestIn ? latestIn.timestamp : null,
      ...perweek,
    };
  }

  /**
   * 특정 월에 대해 체류했던 시간을 조회합니다.
   *
   * @param user 로그인한 사용자 세션
   * @returns UsageResponseDto
   */
  @ApiOperation({
    summary: '월별 체류시간 조회',
    description: '월별 체류시간을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: UsageResponseDto,
    description: '조회 성공',
  })
  @ApiResponse({ status: 401, description: '접근 권한 없음' })
  @Get('permonth')
  @UseGuards(CheckLogin)
  async getPerMonth(
    @User(new ValidationPipe({ validateCustomDecorators: true })) user: any,
  ): Promise<UsageResponseDto> {
    this.logger.debug(`call getPerMonth request by ${user.login}`);
    const userId = user.login;
    const date = new Date();
    const permonth = await this.usageService.getPerMonth(userId, date);
    const latest = await this.usageService.getLatestDataById(userId);
    const latestIn = await this.usageService.getLatestInById(userId);
    return {
      userId: user.login,
      profile: user.image_url,
      state: latest ? latest.inout : null,
      lastCheckInAt: latestIn ? latestIn.timestamp : null,
      ...permonth,
    };
  }
}

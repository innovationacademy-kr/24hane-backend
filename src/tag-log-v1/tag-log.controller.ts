import {
  Controller,
  Get,
  Logger,
  ParseIntPipe,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckLogin } from 'src/auth/guard/check-login.guard';
import { User } from 'src/auth/user.decorator';
import { UserInOutLogsType } from './dto/UserInOutLogs.type';
import { TagLogService } from './tag-log.service';

@ApiTags('체류 시간 산출')
@Controller({
  version: '1',
  path: 'tag-log',
})
export class TagLogController {
  private logger = new Logger(TagLogController.name);

  constructor(private tagLogService: TagLogService) {}

  /**
   * 특정 일에 대해 체류했던 시간을 조회합니다.
   *
   * @param user 로그인한 사용자 세션
   * @returns UserInOutLogsType
   */
  @ApiOperation({
    summary: '일별 체류시간 조회',
    description: '일별 체류시간을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: UserInOutLogsType,
    description: '조회 성공',
  })
  @ApiResponse({ status: 400, description: '쿼리 타입 에러' })
  @ApiResponse({ status: 401, description: '접근 권한 없음' })
  @ApiQuery({
    name: 'year',
    description: '년도',
    required: true,
  })
  @ApiQuery({
    name: 'month',
    description: '월',
    required: true,
  })
  @ApiQuery({
    name: 'day',
    description: '일',
    required: true,
  })
  @Get('perday')
  @UseGuards(CheckLogin)
  async getPerDay(
    @User(new ValidationPipe({ validateCustomDecorators: true })) user: any,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('day', ParseIntPipe) day: number,
  ): Promise<UserInOutLogsType> {
    this.logger.debug(
      `call getPerDay request by ${user.login} at ${year}-${month}-${day}`,
    );
    const inOutLogs = [
      {
        inTimeStamp: 1658984564,
        outTimeStamp: 1658984574,
        durationSecond: 10,
      },
    ];
    return {
      login: user.login,
      profileImage: user.image_url,
      inOutLogs,
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
    type: UserInOutLogsType,
    description: '조회 성공',
  })
  @ApiResponse({ status: 400, description: '쿼리 타입 에러' })
  @ApiResponse({ status: 401, description: '접근 권한 없음' })
  @ApiQuery({
    name: 'year',
    description: '년도',
    required: true,
  })
  @ApiQuery({
    name: 'month',
    description: '월',
    required: true,
  })
  @Get('permonth')
  @UseGuards(CheckLogin)
  async getPerMonth(
    @User(new ValidationPipe({ validateCustomDecorators: true })) user: any,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ): Promise<UserInOutLogsType> {
    this.logger.debug(
      `call getPerDay request by ${user.login} at ${year}-${month}`,
    );
    const inOutLogs = [
      {
        inTimeStamp: 1658984564,
        outTimeStamp: 1658984574,
        durationSecond: 10,
      },
    ];
    return {
      login: user.login,
      profileImage: user.image_url,
      inOutLogs,
    };
  }
}

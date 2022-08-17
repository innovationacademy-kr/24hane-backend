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
import { UserSessionDto } from 'src/auth/42/user.session.dto';
import { CheckLogin } from 'src/auth/guard/check-login.guard';
import { User } from 'src/auth/user.decorator';
import InOut from 'src/enums/inout.enum';
import { UserAccumulationType } from './dto/user-accumulation.type';
import { UserInfoType } from './dto/user-Info.type';
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
  @ApiResponse({
    status: 500,
    description: '서버 내부 에러 (백앤드 관리자 문의 필요)',
  })
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
    @User() user: UserSessionDto,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('day', ParseIntPipe) day: number,
  ): Promise<UserInOutLogsType> {
    this.logger.debug(
      `call getPerDay request by ${user.login} at ${year}-${month}-${day}`,
    );

    const date = new Date(`${year}-${month}-${day}`);

    const results = await this.tagLogService.getPerDay(user.userId, date);
    return {
      login: user.login,
      profileImage: user.image_url,
      inOutLogs: results,
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
  @ApiResponse({
    status: 500,
    description: '서버 내부 에러 (백앤드 관리자 문의 필요)',
  })
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
    @User() user: UserSessionDto,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ): Promise<UserInOutLogsType> {
    this.logger.debug(
      `call getPerDay request by ${user.login} at ${year}-${month}`,
    );

    const date = new Date(`${year}-${month}`);

    const results = await this.tagLogService.getPerMonth(user.userId, date);
    return {
      login: user.login,
      profileImage: user.image_url,
      inOutLogs: results,
    };
  }

  /**
   * 로그인한 유저가 메인 화면에 접속할 때 가져올 정보를 반환합니다.
   */
  @ApiOperation({
    summary: '사용자 접속 시 보여줄 메인 정보',
    description:
      '로그인한 유저가 메인 화면에 접속할 때 가져올 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: UserInfoType,
    description: '조회 성공',
  })
  @ApiResponse({ status: 401, description: '접근 권한 없음' })
  @ApiResponse({
    status: 500,
    description: '서버 내부 에러 (백앤드 관리자 문의 필요)',
  })
  @Get('maininfo')
  @UseGuards(CheckLogin)
  async getMainInfo(@User() user: UserSessionDto): Promise<UserInfoType> {
    this.logger.debug(`call getMainInfo request by ${user.login}`);
    const result: UserInfoType = {
      login: user.login,
      profileImage: user.image_url,
      isAdmin: user.is_staff,
      inoutState: InOut.IN,
    };
    return result;
  }

  /**
   * 로그인한 유저의 일별/월별 누적 체류시간을 반환합니다.
   */
  @ApiOperation({
    summary: '로그인한 유저의 일별/월별 누적 체류시간',
    description: '로그인한 유저의 일별/월별 누적 체류시간을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: UserAccumulationType,
    description: '조회 성공',
  })
  @ApiResponse({ status: 401, description: '접근 권한 없음' })
  @ApiResponse({
    status: 500,
    description: '서버 내부 에러 (백앤드 관리자 문의 필요)',
  })
  @Get('accumulationTimes')
  @UseGuards(CheckLogin)
  async getAccumulationTimes(
    @User() user: UserSessionDto,
  ): Promise<UserAccumulationType> {
    this.logger.debug(`call getAccumulationTimes request by ${user.login}`);
    const date = new Date();
    const resultDay = await this.tagLogService.getPerDay(user.userId, date);
    const resultMonth = await this.tagLogService.getPerMonth(user.userId, date);

    const resultDaySum = resultDay.reduce(
      (prev, result) => result.durationSecond + prev,
      0,
    );
    const resultMonthSum = resultMonth.reduce(
      (prev, result) => result.durationSecond + prev,
      0,
    );

    const result: UserAccumulationType = {
      todayAccumationTime: resultDaySum,
      monthAccumationTime: resultMonthSum,
    };
    return result;
  }
}

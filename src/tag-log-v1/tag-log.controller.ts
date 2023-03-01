import {
  Controller,
  Get,
  Logger,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/auth/user.decorator';
import { UserSessionDto } from 'src/auth/dto/user.session.dto';
import { UserAccumulationType } from './dto/user-accumulation.type';
import { UserInfoType } from './dto/user-Info.type';
import { UserInOutLogsType } from './dto/UserInOutLogs.type';
import { TagLogService } from './tag-log.service';
import { UserAuthGuard } from 'src/auth/guard/user-auth.guard';
import { DateCalculator } from 'src/utils/date-calculator.component';

@ApiTags('체류 시간 산출')
@Controller({
  version: '1',
  path: 'tag-log',
})
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
export class TagLogController {
  private logger = new Logger(TagLogController.name);

  constructor(
    private tagLogService: TagLogService,
    private dateCalculator: DateCalculator,
  ) {}

  /**
   * 특정 일에 대해 태깅했던 로그를 조회합니다.
   *
   * @param user 로그인한 사용자 세션
   * @returns UserInOutLogsType
   */
  @ApiOperation({
    summary: '일별 태그로그 조회',
    description: '일별 짝이 맞는 태그로그를 조회합니다.',
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
  @Get('getTagPerDay')
  async getTagPerDay(
    @User() user: UserSessionDto,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('day', ParseIntPipe) day: number,
  ): Promise<UserInOutLogsType> {
    this.logger.debug(`@getTagPerDay) ${year}-${month}-${day} by ${user.login}`);

    const date = new Date(`${year}-${month}-${day}`);

    const results = await this.tagLogService.getTagPerDay(user.user_id, date);
    return {
      login: user.login,
      profileImage: user.image_url,
      inOutLogs: results,
    };
  }

  /**
   * 특정 일에 대한 모든 태그로그를 조회합니다.
   *
   * @param user 로그인한 사용자 세션
   * @returns UserInOutLogsType
   */
  @ApiOperation({
    summary: '일별 모든 태그로그 조회',
    description: '일별 모든 태그로그를 조회합니다.',
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
  @Get('getAllTagPerDay')
  async getAllTagPerDay(
    @User() user: UserSessionDto,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('day', ParseIntPipe) day: number,
  ): Promise<UserInOutLogsType> {
    this.logger.debug(`@getAllTagPerDay) ${year}-${month}-${day} by ${user.login}`);

    const date = new Date(`${year}-${month}-${day}`);

    const results = await this.tagLogService.getAllTagPerDay(user.user_id, date);
    return {
      login: user.login,
      profileImage: user.image_url,
      inOutLogs: results,
    };
  }

  /**
   * 특정 월에 대해 태깅했던 로그를 조회합니다.
   *
   * @param user 로그인한 사용자 세션
   * @returns UsageResponseDto
   */
  @ApiOperation({
    summary: '월별 태그로그 조회',
    description: '월별 짝이 맞는 태그로그를 조회합니다.',
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
  @Get('getTagPerMonth')
  async getTagPerMonth(
    @User() user: UserSessionDto,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ): Promise<UserInOutLogsType> {
    this.logger.debug(`@getTagPerMonth) ${year}-${month} by ${user.login}`);

    const date = new Date(`${year}-${month}`);

    const results = await this.tagLogService.getTagPerMonth(user.user_id, date);
    return {
      login: user.login,
      profileImage: user.image_url,
      inOutLogs: results,
    };
  }

  /**
   * 특정 월에 대한 모든 태그로그를 조회합니다.
   *
   * @param user 로그인한 사용자 세션
   * @returns UsageResponseDto
   */
    @ApiOperation({
      summary: '월별 모든 태그로그 조회',
      description: '월별 모든 태그로그를 조회합니다.',
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
    @Get('getAllTagPerMonth')
    async getAllTagPerMonth(
      @User() user: UserSessionDto,
      @Query('year', ParseIntPipe) year: number,
      @Query('month', ParseIntPipe) month: number,
    ): Promise<UserInOutLogsType> {
      this.logger.debug(`@getTagPerMonth) ${year}-${month} by ${user.login}`);
  
      const date = new Date(`${year}-${month}`);
  
      const results = await this.tagLogService.getAllTagPerMonth(user.user_id, date);
      return {
        login: user.login,
        profileImage: user.image_url,
        inOutLogs: results,
      };
    }

  ///**
  // * 입력 월을 포함한 6개월간의 체류했던 시간을 조회합니다.
  // *
  // * @param user 로그인한 사용자 세션
  // * @returns number[]
  // */
  //@ApiOperation({
  //  summary: '최근 6개월간의 체류시간 조회',
  //  description: '최근 6개월간의 체류시간을 조회합니다.',
  //})
  //@ApiResponse({
  //  status: 200,
  //  type: Array,
  //  description: '조회 성공',
  //})
  //@ApiResponse({ status: 400, description: '쿼리 타입 에러' })
  //@ApiResponse({ status: 401, description: '접근 권한 없음' })
  //@ApiResponse({
  //  status: 500,
  //  description: '서버 내부 에러 (백앤드 관리자 문의 필요)',
  //})
  //@Get('getTimeSixMonth')
  //async getTimeSixMonth(
  //  @User() user: UserSessionDto,
  //): Promise<number[]> {
  //  this.logger.debug(`@getTimeSixMonth) by ${user.login}`);

  //  const monthPairs = this.tagLogService.getTimeSixMonth(user.user_id);

  //  return monthPairs;
  //}

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
  async getMainInfo(@User() user: UserSessionDto): Promise<UserInfoType> {
    this.logger.debug(`@getMainInfo) by ${user.login}`);
    const inoutState = await this.tagLogService.checkClusterById(user.user_id);
    const result: UserInfoType = {
      login: user.login,
      profileImage: user.image_url,
      isAdmin: user.is_staff,
      inoutState: inoutState.inout,
      tagAt: inoutState.log,
    };
    return result;
  }

  /**
   * 로그인한 유저의 일별/월별 누적 체류시간을 반환합니다.
   */
  @ApiOperation({
    summary: '로그인한 유저의 일별/월별 누적 체류시간',
    description: '로그인한 유저의 일별/월별 누적 체류시간을 조s회합니다.',
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
  async getAccumulationTimes(
    @User() user: UserSessionDto,
  ): Promise<UserAccumulationType> {
    this.logger.debug(`@getAccumulationTimes) by ${user.login}`);
    const date = new Date();
    const resultDay = await this.tagLogService.getTagPerDay(user.user_id, date);
    const resultMonth = await this.tagLogService.getTagPerMonth(
      user.user_id,
      date,
    );

    const resultDaySum = resultDay.reduce(
      (prev, result) => result.durationSecond + prev,
      0,
    );
    const resultMonthSum = resultMonth.reduce(
      (prev, result) => result.durationSecond + prev,
      0,
    );

    const resultSixWeekArray = await this.tagLogService.getTimeSixWeek(user.user_id);
    const resultSixMonthArray = await this.tagLogService.getTimeSixMonth(user.user_id);

    const result: UserAccumulationType = {
      todayAccumulationTime: resultDaySum,
      monthAccumulationTime: resultMonthSum,
      sixWeekAccumulationTime: resultSixWeekArray,
      sixMonthAccumulationTime: resultSixMonthArray,
    };
    return result;
  }
}

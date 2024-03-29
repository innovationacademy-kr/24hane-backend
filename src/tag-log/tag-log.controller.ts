import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Inject,
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
import { Cache } from 'cache-manager';
import { UserSessionDto } from 'src/auth/dto/user.session.dto';
import { UserAuthGuard } from 'src/auth/guard/user-auth.guard';
import { User } from 'src/auth/user.decorator';
import { CadetPerClusterDto } from 'src/statistics/dto/cadet-per-cluster.dto';
import { StatisticsService } from 'src/statistics/statistics.service';
import { UserInOutLogsType } from './dto/UserInOutLogs.type';
import { UserInfoTypeV4 } from './dto/user-Info.type';
import { UserAccumulationTypeV2 } from './dto/user-accumulation.type.v2';
import { TagLogService } from './tag-log.service';

@ApiTags('체류 시간 산출 v2')
@Controller({
  version: '2',
  path: 'tag-log',
})
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
export class TagLogController {
  private logger = new Logger(TagLogController.name);

  constructor(
    private tagLogService: TagLogService,
    private statisticsService: StatisticsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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
    this.logger.debug(
      `@getAllTagPerDay) ${year}-${month}-${day} by ${user.login}`,
    );

    const date = new Date(`${year}-${month}-${day}`);

    const results = await this.tagLogService.getAllTagPerDay(
      user.user_id,
      date,
    );

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
    this.logger.debug(`@getAllTagPerMonth) ${year}-${month} by ${user.login}`);

    const date = new Date(`${year}-${month}`);

    const results = await this.tagLogService.getAllTagPerMonth(
      user.user_id,
      date,
    );

    return {
      login: user.login,
      profileImage: user.image_url,
      inOutLogs: results,
    };
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
    type: UserAccumulationTypeV2,
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
  ): Promise<UserAccumulationTypeV2> {
    this.logger.debug(`@getAccumulationTimes) by ${user.login}`);

    const date = new Date();

    const resultDay = await this.tagLogService.getAllTagPerDay(
      user.user_id,
      date,
    );

    const todayAccumulationTime = resultDay.reduce(
      (prev, result) => result.durationSecond + prev,
      0,
    );

    const resultMonth = await this.tagLogService.getAllTagPerMonth(
      user.user_id,
      date,
    ); //todo: change to all tag (and check plus null value)

    const monthAccumulationTime = resultMonth.reduce(
      (prev, result) => result.durationSecond + prev,
      0,
    );

    const sixWeekAccumulationTime = await this.tagLogService.getTimeSixWeek(
      user.user_id,
    );

    const sixMonthAccumulationTime = await this.tagLogService.getTimeSixMonth(
      user.user_id,
    );

    const result: UserAccumulationTypeV2 = {
      todayAccumulationTime,
      monthAccumulationTime,
      sixWeekAccumulationTime,
      sixMonthAccumulationTime,
    };

    return result;
  }

  /**
   * 로그인한 유저가 메인 화면에 접속할 때 가져올 정보를 반환합니다.
   * For removal in 5.0.0
   */
  @ApiOperation({
    summary: '사용자 접속 시 보여줄 메인 정보',
    description:
      '로그인한 유저가 메인 화면에 접속할 때 가져올 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: UserInfoTypeV4,
    description: '조회 성공',
  })
  @ApiResponse({ status: 401, description: '접근 권한 없음' })
  @ApiResponse({
    status: 500,
    description: '서버 내부 에러 (백앤드 관리자 문의 필요)',
  })
  @Get('maininfo')
  async getMainInfo(@User() user: UserSessionDto): Promise<UserInfoTypeV4> {
    this.logger.debug(`@getMainInfo) by ${user.login}`);
    const inoutState = await this.tagLogService.checkClusterById(user.user_id);
    // FIXME: 추후에 캐시 관련 리팩터링 필요
    let cadetPerCluster: undefined | CadetPerClusterDto[] =
      await this.cacheManager.get('getCadetPerClusterV4');
    if (cadetPerCluster === undefined) {
      cadetPerCluster = await this.statisticsService.getCadetPerCluster(2);
      await this.cacheManager.set('getCadetPerClusterV4', cadetPerCluster, 60);
    }
    const gaepo = +cadetPerCluster.find((v) => v.cluster === 'GAEPO')?.cadet;
    const result: UserInfoTypeV4 = {
      login: user.login,
      profileImage: user.image_url,
      isAdmin: user.is_staff,
      inoutState: inoutState.inout,
      tagAt: inoutState.log,
      gaepo: gaepo ? gaepo : 0,
      seocho: 0,
    };
    return result;
  }
}

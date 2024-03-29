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
import { UserInfoType } from 'src/tag-log/dto/user-Info.type';
import { UserAccumulationTypeV3 } from 'src/tag-log/dto/user-accumulation.type.v3';
import { TagLogService } from 'src/tag-log/tag-log.service';
import { TWELVE_HOURS_IN_SECONDS } from 'src/utils/data-calculator/common.constants';
import { MessageGenerator } from 'src/utils/message-generator/message-generator.component';
import { UserMonthlyInOutLogsType } from '../tag-log/dto/UserMonthlyInOutLogs.type';
import {
  InOutLogPerDay,
  groupLogsByDay,
} from '../tag-log/dto/subType/InOutLogPerDay.type';

@ApiTags('체류 시간 산출 v3')
@Controller({
  version: '3',
  path: 'tag-log',
})
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
export class TagLogController {
  private logger = new Logger(TagLogController.name);

  constructor(
    private tagLogService: TagLogService,
    private statisticsService: StatisticsService,
    private messageGenerator: MessageGenerator,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * 특정 월에 대한 모든 태그로그를 조회합니다.
   *
   * @param user 로그인한 사용자 세션
   * @returns UsageResponseDto
   */
  @ApiOperation({
    summary: '월별 모든 태그로그 및 인정 누적시간 조회',
    description: '월별 모든 태그로그 및 인정 누적시간을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: UserMonthlyInOutLogsType,
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
  ): Promise<UserMonthlyInOutLogsType> {
    this.logger.debug(`@getAllTagPerMonth) ${year}-${month} by ${user.login}`);

    const date = new Date(`${year}-${month}`);

    const results = await this.tagLogService.getAllTagPerMonth(
      user.user_id,
      date,
    );
    const monthlyAccumulationTime = results.reduce(
      (prev, result) => result.durationSecond + prev,
      0,
    );

    const InOutLogPerDays: InOutLogPerDay[] = groupLogsByDay(
      results,
      TWELVE_HOURS_IN_SECONDS,
    );

    const filteredMonthlyAccumulationTime = InOutLogPerDays.reduce(
      (prev, result) =>
        result.getDurationSecondWithFilter(TWELVE_HOURS_IN_SECONDS) + prev,
      0,
    );

    return {
      login: user.login,
      profileImage: user.image_url,
      inOutLogs: results,
      totalAccumulationTime: monthlyAccumulationTime,
      acceptedAccumulationTime: filteredMonthlyAccumulationTime,
    };
  }

  /**
   * 로그인한 유저가 메인 화면에 접속할 때 가져올 정보를 반환합니다.
   *
   * @version 4 gaepo, seocho 인원 수 반환 추가
   * @version 5 클러스터가 사라짐에 따라 seocho 인원 수 반환 제거 및 infoMessage 추가
   */
  @ApiOperation({
    summary: '사용자 접속 시 보여줄 메인 정보',
    description: '메인 화면에서 필요한 정보들을 모두 조회합니다.',
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
    // FIXME: 추후에 캐시 관련 리팩터링 필요
    let cadetPerCluster: undefined | CadetPerClusterDto[] =
      await this.cacheManager.get('getCadetPerCluster');
    if (cadetPerCluster === undefined) {
      cadetPerCluster = await this.statisticsService.getCadetPerCluster(2);
      await this.cacheManager.set('getCadetPerCluster', cadetPerCluster, 60);
    }
    const gaepo = +cadetPerCluster.find((v) => v.cluster === 'GAEPO')?.cadet;
    // const seocho = +cadetPerCluster.find((v) => v.cluster === 'SEOCHO')?.cadet;

    const infoMessages = this.messageGenerator.generateInfoMessages();

    const result: UserInfoType = {
      login: user.login,
      profileImage: user.image_url,
      isAdmin: user.is_staff,
      inoutState: inoutState.inout,
      tagAt: inoutState.log,
      gaepo: gaepo ? gaepo : 0,
      // seocho: seocho ? seocho : 0,
      infoMessages: infoMessages,
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
    type: UserAccumulationTypeV3,
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
  ): Promise<UserAccumulationTypeV3> {
    this.logger.debug(`@getAccumulationTimes) by ${user.login}`);
    const date = new Date();
    const resultDay = await this.tagLogService.getAllTagPerDay(
      user.user_id,
      date,
    );
    const resultMonth = await this.tagLogService.getAllTagPerMonth(
      user.user_id,
      date,
    ); //todo: change to all tag (and check plus null value)

    const resultPerDay: InOutLogPerDay[] = groupLogsByDay(
      resultMonth,
      TWELVE_HOURS_IN_SECONDS,
    );

    // 하루 최대 인정시간 합
    const resultDaySumWithFilter = resultPerDay.reduce(
      (prev, result) => result.getDurationSecondPerDay() + prev,
      0,
    );

    const resultDaySum = resultDay.reduce(
      (prev, result) => result.durationSecond + prev,
      0,
    );

    const resultMonthSum = resultMonth.reduce(
      (prev, result) => result.durationSecond + prev,
      0,
    );

    const resultSixWeekArray = await this.tagLogService.getTimeSixWeek(
      user.user_id,
    );
    const resultSixMonthArray = await this.tagLogService.getTimeSixMonth(
      user.user_id,
    );

    const result: UserAccumulationTypeV3 = {
      todayAccumulationTime: resultDaySum,
      monthAccumulationTime: resultMonthSum,
      sixWeekAccumulationTime: resultSixWeekArray,
      sixMonthAccumulationTime: resultSixMonthArray,
      monthlyAcceptedAccumulationTime: resultDaySumWithFilter,
    };
    return result;
  }
}

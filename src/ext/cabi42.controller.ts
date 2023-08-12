import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserSessionDto } from 'src/auth/dto/user.session.dto';
import { ExtAuthGuard } from 'src/auth/guard/ext-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserAccumulationMonthType } from '../tag-log-v2/dto/admin/user-accumulation-month.type';
import { TagLogAdminService } from '../tag-log-v2/tag-log-v2-admin.service';

@ApiTags('Cabi42 전용 API')
@Controller('ext/cabi42')
@ApiBearerAuth()
@UseGuards(ExtAuthGuard)
export class Cabi42Controller {
  private logger = new Logger(Cabi42Controller.name);

  constructor(private tagLogAdminService: TagLogAdminService) {}

  /**
   * 모든 이용자의 월별 누적 출입시간을 반환합니다.
   *
   * @returns UserAccumulationMonthType[]
   */
  @ApiOperation({
    summary: '모든 이용자의 월별 체류시간 조회',
    description: '모든 이용자의 월별 체류시간을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: [UserAccumulationMonthType],
    description: '조회 성공',
  })
  @ApiResponse({ status: 400, description: '잘못된 날짜 입력' })
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
  async getPerMonth(
    @User() user: UserSessionDto,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ): Promise<UserAccumulationMonthType[]> {
    this.logger.debug(`@getPerMonth) ${year}-${month} by ${user.login}`);

    const results = await this.tagLogAdminService.getAccumulationInMonthByAll(
      year,
      month,
    );
    return results;
  }

  /**
   * 특정 이용자의 월별 누적 출입시간을 반환합니다.
   *
   * @returns UserAccumulationMonthType
   */
  @ApiOperation({
    summary: '특정 이용자의 월별 체류시간 조회',
    description: '특정 이용자의 월별 체류시간을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: UserAccumulationMonthType,
    description: '조회 성공',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 날짜 입력 / 존재하지 않는 login id',
  })
  @ApiResponse({ status: 401, description: '접근 권한 없음' })
  @ApiResponse({
    status: 500,
    description: '서버 내부 에러 (백앤드 관리자 문의 필요)',
  })
  @ApiParam({
    name: 'login',
    description: '42 로그인 ID들을 ,로 나열한 형태',
    required: true,
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
  @Get('permonth/:login')
  async getPerMonthByLogin(
    @User() user: UserSessionDto,
    @Param('login') loginParam: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ): Promise<UserAccumulationMonthType[]> {
    this.logger.debug(`@getPerMonthByLogin) ${year}-${month} by ${user.login}`);

    const logins: string[] = loginParam.split(',');

    const results: UserAccumulationMonthType[] = [];

    await Promise.all(
      logins.map(async (login) => {
        const id = await this.tagLogAdminService.findIdByLogin(login);
        if (id < 0) {
          throw new BadRequestException({
            message: `${login}은 서버상에 존재하지 않는 login ID입니다.`,
          });
        }

        const result = await this.tagLogAdminService.getAccumulationInMonthById(
          id,
          login,
          year,
          month,
        );
        results.push(result);
      }),
    );

    return results;
  }
}

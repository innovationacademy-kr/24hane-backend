import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserSessionDto } from 'src/auth/42/user.session.dto';
import { CheckLogin } from 'src/auth/guard/check-login.guard';
import { User } from 'src/auth/user.decorator';
import { UserAccumulationDayType } from './dto/admin/user-accumulation-day.type';
import { UserAccumulationMonthType } from './dto/admin/user-accumulation-month.type';
import { TagLogAdminService } from './tag-log-admin.service';

@ApiTags('체류 시간 산출 (관리자 전용 API)')
@Controller({
  version: '1',
  path: 'tag-log/admin',
})
export class TagLogAdminController {
  private logger = new Logger(TagLogAdminController.name);

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
  @UseGuards(CheckLogin)
  async getPerMonth(
    @User() user: UserSessionDto,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ): Promise<UserAccumulationMonthType[]> {
    this.logger.debug(
      `call getPerMonth request at ${year}-${month} by ${user.login}`,
    );
    if (!user.is_staff) {
      throw new UnauthorizedException({
        description: '관리자 계정으로만 이용 가능한 기능입니다.',
      });
    }
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
  @UseGuards(CheckLogin)
  async getPerMonthByLogin(
    @User() user: UserSessionDto,
    @Param('login') login: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ): Promise<UserAccumulationMonthType> {
    this.logger.debug(`call getPerMonth request at ${year}-${month}`);
    if (!user.is_staff) {
      throw new UnauthorizedException({
        description: '관리자 계정으로만 이용 가능한 기능입니다.',
      });
    }
    const id = await this.tagLogAdminService.findIdByLogin(login);
    if (id < 0) {
      throw new BadRequestException({
        message: '서버상에 존재하지 않는 login ID입니다.',
      });
    }
    const result = await this.tagLogAdminService.getAccumulationInMonthById(
      id,
      login,
      year,
      month,
    );
    return result;
  }

  /**
   * 모든 이용자의 이용자 별 일별 누적 출입시간을 반환합니다.
   *
   * @returns UserAccumulationDayType[]
   */
  @ApiOperation({
    summary: '모든 이용자의 일별 체류시간 조회',
    description: '모든 이용자의 일별 체류시간을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: [UserAccumulationDayType],
    description: '조회 성공',
  })
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
  @Get('perdays')
  @UseGuards(CheckLogin)
  async getPerDays(
    @User() user: UserSessionDto,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ): Promise<UserAccumulationDayType[]> {
    this.logger.debug(`call getPerDays request at ${year}-${month}`);
    if (!user.is_staff) {
      throw new UnauthorizedException({
        description: '관리자 계정으로만 이용 가능한 기능입니다.',
      });
    }
    const results = await this.tagLogAdminService.getPerDaysByAll(year, month);
    return results;
  }

  /**
   * 특정 이용자의 일별 누적 출입시간을 반환합니다.
   *
   * @returns UserAccumulationDayType
   */
  @ApiOperation({
    summary: '특정 이용자의 일별 체류시간 조회',
    description: '특정 이용자의 일별 체류시간을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: UserAccumulationDayType,
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
  @Get('perdays/:login')
  @UseGuards(CheckLogin)
  async getPerDaysByLogin(
    @User() user: UserSessionDto,
    @Param('login') login: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ): Promise<UserAccumulationDayType> {
    this.logger.debug(`call getPerDays request at ${year}-${month}`);
    if (!user.is_staff) {
      throw new UnauthorizedException({
        description: '관리자 계정으로만 이용 가능한 기능입니다.',
      });
    }
    const id = await this.tagLogAdminService.findIdByLogin(login);
    if (id < 0) {
      throw new BadRequestException({
        message: '서버상에 존재하지 않는 login ID입니다.',
      });
    }
    const result = this.tagLogAdminService.getPerDaysById(
      id,
      login,
      year,
      month,
    );
    return result;
  }
}

import {
  Controller,
  Get,
  Logger,
  ParseIntPipe,
  Query,
  UnauthorizedException,
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
import { UserAccumulationDayType } from './dto/admin/user-accumulation-day.type';
import { TagLogCabiService } from './tag-log-v2-cabi.service';
import { ExtAuthGuard } from 'src/auth/guard/ext-auth.guard';

@ApiTags('체류 시간 산출 V2 (cabi 전용 API)')
@ApiBearerAuth()
@UseGuards(ExtAuthGuard)
@Controller({
  version: '2',
  path: 'tag-log/cabi',
})
export class TagLogCabiController {
  private logger = new Logger(TagLogCabiController.name);

  constructor(private tagLogCabiService: TagLogCabiService) {}
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
  async getPerDays(
    @User() user: UserSessionDto,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ): Promise<UserAccumulationDayType[]> {
    this.logger.debug(`@getPerDays) ${year}-${month} by ${user.login}`);
    if (!user.is_staff) {
      throw new UnauthorizedException({
        description: '관리자 계정으로만 이용 가능한 기능입니다.',
      });
    }
    const results = await this.tagLogCabiService.getPerDaysByAll(year, month);
    return results;
  }
}

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
import { UserSessionDto } from 'src/auth/dto/user.session.dto';
import { ExtAuthGuard } from 'src/auth/guard/ext-auth.guard';
import { User } from 'src/auth/user.decorator';
import { Cabi42Service } from './cabi42.service';
import { Cabi42ResponseDto } from './dto/cabi42.response.dto';

@ApiTags('Cabi42 전용 API')
@Controller('ext/cabi42')
@ApiBearerAuth()
@UseGuards(ExtAuthGuard)
export class Cabi42Controller {
  private logger = new Logger(Cabi42Controller.name);

  constructor(private cabi42Service: Cabi42Service) {}

  /**
   * 모든 이용자의 월별 누적 출입시간을 반환합니다.
   *
   * @returns Cabi42ResponseDto[]
   */
  @ApiOperation({
    summary: '모든 이용자의 월별 체류시간 조회',
    description: '모든 이용자의 월별 체류시간을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: [Cabi42ResponseDto],
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
  ): Promise<Cabi42ResponseDto[]> {
    this.logger.debug(`@getPerMonth) ${year}-${month} by ${user.login}`);
    return await this.cabi42Service.cabi42(year, month);
  }
}

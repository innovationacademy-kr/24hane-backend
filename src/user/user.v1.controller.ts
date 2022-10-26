import {
  Controller,
  Get,
  Logger,
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
import { IdLoginDto } from './dto/id-login.dto';
import { UserService } from './user.service';
import { AdminAuthGuard } from 'src/auth/guard/admin-auth.guard';

@ApiTags('유저 정보 관련')
@Controller({
  version: '1',
  path: 'user',
})
export class UserV1Controller {
  private logger = new Logger(UserV1Controller.name);

  constructor(private userService: UserService) {}

  /**
   * 모든 이용자의 월별 누적 출입시간을 반환합니다.
   *
   * @returns IdLoginDto[]
   */
  @ApiOperation({
    summary: '관리자를 제외한 모든 이용자 조회 (관리자 전용 API)',
    description:
      '관리자를 제외한 모든 이용자 고유 ID와 로그인 ID를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: [IdLoginDto],
    description: '조회 성공',
  })
  @ApiResponse({ status: 401, description: '접근 권한 없음' })
  @ApiResponse({
    status: 500,
    description: '서버 내부 에러 (백앤드 관리자 문의 필요)',
  })
  @ApiQuery({
    name: 'session',
    description: '관리자 인증을 위한 JWT Token',
    required: true,
  })
  @Get('admin/allcadets')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  async getAllCadets(@User() user: UserSessionDto): Promise<IdLoginDto[]> {
    this.logger.debug(`call getAllCadets request by ${user.login}`);
    if (!user.is_staff) {
      throw new UnauthorizedException({
        description: '관리자 계정으로만 이용 가능한 기능입니다.',
      });
    }
    const results = await this.userService.getAllIds(false);
    return results;
  }
}

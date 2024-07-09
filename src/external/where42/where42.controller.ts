import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExtAuthGuard } from 'src/auth/guard/ext-auth.guard';
import { Where42ResponseDto } from './dto/where42.response.dto';
import { Where42Service } from './where42.service';

@ApiTags('Where42 전용 API')
@Controller('ext/where42')
@ApiBearerAuth()
@UseGuards(ExtAuthGuard)
export class Where42Controller {
  private logger = new Logger(Where42Controller.name);

  constructor(private where42Service: Where42Service) {}

  /**
   * 특정 사용자가 클러스터에 체류중인지 확인합니다.
   * 체류중인 클러스터의 장소 정보를 출력하며 마지막으로 태깅한 시간도 가져옵니다.
   *
   * @param user 유저 로그인 ID
   * @returns Where42ResponseDto
   */
  @ApiOperation({
    summary: '특정 카뎃의 클러스터 체류여부 확인',
    description:
      '특정 사용자가 클러스터에 체류중인지 확인합니다. 체류중인 클러스터의 장소 정보를 출력하며 마지막으로 태깅한 시간도 가져옵니다.',
  })
  @ApiResponse({
    status: 200,
    type: Where42ResponseDto,
    description: '조회 성공',
  })
  @ApiResponse({ status: 400, description: 'DB상 존재하지 않는 카뎃' })
  @ApiResponse({ status: 401, description: '접근 권한 없음 (토큰 만료 등)' })
  @ApiResponse({ status: 403, description: '태그 기록이 존재하지 않는 카뎃' })
  @ApiResponse({ status: 500, description: '서버 내부 에러' })
  @ApiParam({
    name: 'login',
    description: '42 로그인 ID',
    required: true,
  })
  @Get('where42/:login')
  async where42(@Param('login') login: string): Promise<Where42ResponseDto> {
    this.logger.debug(`@islogin) where42: ${login}`);
    return this.where42Service.where42(login);
  }

  @Post('where42All')
  async where42All(@Body() logins: string[]): Promise<Where42ResponseDto[]> {
    this.logger.debug(`@where42All) where42All`);
    return this.where42Service.where42All(logins);
  }
}

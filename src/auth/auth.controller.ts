import { Controller, Get, HttpCode, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FtGuard } from './42/guard/ft.guard';
import { CheckLogin } from './guard/check-login.guard';

@ApiTags('인증/인가 관련')
@Controller('user/login')
export class Auth42Controller {
  @ApiOperation({
    summary: '42 계정 로그인 링크',
    description: '42 OAuth를 이용해 로그인을 진행합니다.',
  })
  @ApiQuery({
    name: 'redirect',
    description: '로그인 후 리다이렉트 할 URI',
    required: true,
  })
  @Get('42')
  @UseGuards(FtGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ftlogin() {}

  @ApiOperation({
    summary: '42 계정 로그인 콜백 링크',
    description:
      '42 OAuth를 이용해 로그인이 완료되면 해당 주소로 리다이렉트됩니다.',
  })
  @Get('callback/42')
  @UseGuards(FtGuard)
  ftcallback(@Req() req, @Res() res) {
    res.status(302).redirect(req.cookies['redirect']);
  }

  @ApiOperation({
    summary: '로그인 여부 확인',
    description: '현재 로그인이 되어있는지의 여부를 확인합니다.',
  })
  @ApiResponse({ status: 204, description: '로그인이 되어 있음' })
  @ApiResponse({ status: 401, description: '로그인이 되어있지 않음' })
  @Get('islogin')
  @UseGuards(CheckLogin)
  @HttpCode(204)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async islogin() {}
}

import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FtGuard } from './42/guard/ft.guard';

@ApiTags('인증/인가 관련')
@Controller('user/login')
export class Auth42Controller {
  @ApiOperation({
    summary: '42 계정 로그인 링크',
    description: '42 OAuth를 이용해 로그인을 진행합니다.',
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
  @Redirect('/', 302)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ftcallback() {}
}

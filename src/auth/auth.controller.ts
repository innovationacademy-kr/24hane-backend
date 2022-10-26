import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GoogleApi } from 'src/utils/google-api.component';
import { FtOAuthGuard } from './guard/ft-oauth.guard';
import { JWTSignGuard } from './guard/jwt-sign.guard';
import { UserAuthGuard } from './guard/user-auth.guard';
import { User } from './user.decorator';

@ApiTags('인증/인가 관련')
@Controller('user/login')
export class Auth42Controller {
  private logger = new Logger(Auth42Controller.name);

  constructor(private googleApi: GoogleApi) {}

  @ApiOperation({
    summary: '42 계정 로그인 링크',
    description:
      '42 OAuth를 이용해 로그인을 진행합니다. \
      만약 redirect가 없다면 HTTP Body로 토큰을 송부하며 관리자 계정으로 로그인할 경우 구글 스프레드시트로 토큰을 송부합니다.',
  })
  @ApiQuery({
    name: 'redirect',
    description: '로그인 후 리다이렉트 할 URI',
  })
  @Get('42')
  @UseGuards(FtOAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ftlogin() {}

  @ApiOperation({
    summary: '42 계정 로그인 콜백 링크',
    description:
      '42 OAuth를 이용해 로그인이 완료되면 해당 주소로 리다이렉트됩니다.',
  })
  @ApiResponse({
    status: 302,
    description: 'redirect가 있을 경우 리다이렉트됩니다.',
  })
  @ApiResponse({
    status: 200,
    description:
      '토큰을 쿠키에 생성하며 Body로 토큰을 송부합니다. 관리자 권한으로 시도할경우 정상적으로 구글시트에 토큰을 송부하였습니다.',
  })
  @ApiResponse({
    status: 500,
    description: '구글시트 라이브러리 오류로 토큰 송부에 실패하였습니다.',
  })
  @Get('callback/42')
  @UseGuards(FtOAuthGuard, JWTSignGuard)
  async ftcallback(@Req() req, @Res() res, @User() user) {
    this.logger.log(`login callback : ${user.login}`);
    if (req.cookies['redirect']) {
      res.status(302).redirect(req.cookies['redirect']);
    } else {
      if (user && user.is_staff) {
        /**
         * doosoo님의 요청으로 관리자 권한으로 로그인을 할 때 생성된 쿠키를 구글 스프레드시트로 송부하게 해두었습니다.
         */
        const success = await this.googleApi.transportData(
          encodeURIComponent(req.cookies['accessToken']),
        );
        if (success) {
          res.status(200).json({ msg: 'ok' });
        } else {
          res.status(500).json({ msg: 'internal service error' });
        }
      } else {
        res.status(200).json({ accessToken: req.cookies['accessToken'] });
      }
    }
  }

  @ApiOperation({
    summary: '로그인 여부 확인',
    description: '현재 로그인이 되어있는지의 여부를 확인합니다.',
  })
  @ApiResponse({ status: 204, description: '로그인이 되어 있음' })
  @ApiResponse({ status: 401, description: '로그인이 되어있지 않음' })
  @ApiBearerAuth()
  @Get('islogin')
  @UseGuards(UserAuthGuard)
  @HttpCode(204)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async islogin() {}
}

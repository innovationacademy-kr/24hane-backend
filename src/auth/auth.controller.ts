import {
  Controller,
  Get,
  HttpCode,
  Inject,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GoogleApi } from 'src/utils/google-api/google-api.component';
import { FtOAuthGuard } from './guard/ft-oauth.guard';
import { JWTSignGuard } from './guard/jwt-sign.guard';
import { UserAuthGuard } from './guard/user-auth.guard';
import { User } from './user.decorator';

@ApiTags('인증/인가 관련')
@Controller('user/login')
export class Auth42Controller {
  private logger = new Logger(Auth42Controller.name);

  constructor(
    private googleApi: GoogleApi,
    private jwtService: JwtService,
    @Inject(ConfigService)
    private configService: ConfigService,
  ) {}

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
    this.logger.verbose(`@ftcallback) login callback : ${user.login}`);

    const redirectUrl = req.cookies['redirect'];

    res.clearCookie('redirect');

    if (redirectUrl) {
      res.status(302).redirect(redirectUrl);
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
  async islogin() {
    this.logger.debug(`@islogin)`);
  }

  @ApiOperation({
    summary: 'Access 토큰 갱신',
    description: 'Refresh 토큰을 사용하여 새로운 Access 토큰을 발급합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '새로운 Access 토큰이 발급되었습니다.',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh 토큰이 유효하지 않거나 만료되었습니다.',
  })
  @ApiBearerAuth()
  @Post('refresh')
  async refreshToken(@Req() req, @Res() res) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh 토큰을 찾을 수 없습니다.');
    }

    const accessExpiresIn = this.configService.getOrThrow<string>(
      'jwt.accessExpiresIn',
    );

    const jwtSecret = this.configService.getOrThrow<string>('jwt.secret');

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const newAccessToken = await this.jwtService.signAsync(
        { login: payload.login, is_staff: payload.is_staff },
        { expiresIn: accessExpiresIn, secret: jwtSecret },
      );

      const accessTokenExpires = new Date(
        (await this.jwtService.verifyAsync(newAccessToken)['exp']) * 1000,
      );

      res.cookie('accessToken', newAccessToken, {
        expires: accessTokenExpires,
        httpOnly: false,
        domain: req.headers.host.split('.').slice(1).join('.'),
      });

      return res.json({
        accessToken: newAccessToken,
        message: 'Access 토큰이 성공적으로 갱신되었습니다.',
      });
    } catch (e) {
      throw new UnauthorizedException(
        'Refresh 토큰이 유효하지 않거나 만료되었습니다.',
      );
    }
  }
}

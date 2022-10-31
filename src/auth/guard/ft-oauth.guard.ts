import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 42 OAuth 로그인을 수행하는 가드입니다.
 */
@Injectable()
export class FtOAuthGuard extends AuthGuard('42-oauth2') {
  handleRequest(err: any, user: any, info: any) {
    if (err) {
      throw new InternalServerErrorException({
        msg: '42 인증 에러 (원인 : OAuth 토큰 만료 등)',
        err,
        info,
      });
    }
    return user;
  }
}

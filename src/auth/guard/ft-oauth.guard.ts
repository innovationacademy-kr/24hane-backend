import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

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

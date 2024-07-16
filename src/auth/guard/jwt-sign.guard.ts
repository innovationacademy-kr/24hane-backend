import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { UserSessionDto } from 'src/auth/dto/user.session.dto';

/**
 * 사용자 정보를 이용해 JWT 토큰을 발급하여 쿠키에 삽입하는 가드입니다.
 */
@Injectable()
export class JWTSignGuard implements CanActivate {
  private logger = new Logger(JWTSignGuard.name);

  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    return this.generateJWTToken(req, res);
  }

  private generateJWTToken(request: Request, response: Response): boolean {
    const user = request.user as UserSessionDto | undefined;
    if (user === undefined) {
      this.logger.error(`can't generate JWTToken`);
      return false;
    }

    //todo; env설정 및 시간 변경
    const accessToken = this.jwtService.sign(user, {
      expiresIn: '15s',
      secret: 'testing',
    });
    const refreshToken = this.jwtService.sign(
      { ...user, type: 'refresh' },
      { expiresIn: '30s', secret: 'testing' },
    );

    const host = request.headers.host;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, ...words] = host.split('.');
    const domain = words.join('.');

    // NOTE: JWT token의 만료시간을 직접 가져옴.
    const accessTokenexpires = new Date(
      this.jwtService.verify(accessToken)['exp'] * 1000,
    );
    const refreshTokenexpires = new Date(
      this.jwtService.verify(refreshToken)['exp'] * 1000,
    );

    const cookieOptions = {
      expires: accessTokenexpires,
      httpOnly: false,
      domain,
    };

    const refreshcookieOptions = {
      expires: refreshTokenexpires,
      httpOnly: true,
      domain,
    };

    this.logger.debug(`accessToken : ${accessToken}`);
    this.logger.debug(`refreshToken : ${refreshToken}`);

    response.cookie('accessToken', accessToken, cookieOptions);
    response.cookie('refreshToken', refreshToken, refreshcookieOptions);

    return true;
  }
}

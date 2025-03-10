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

    // note: intra id가 지워지는 일이 있어 DB 변경 전까지 임시 처리 (하네DB는 새 인트라 정보가 업데이트 되지 않음)
    // 157970+woosupar -> 215242+woospark

    let jwtPayload: UserSessionDto;

    if (user.user_id == 215242) {
      jwtPayload = {
        user_id: 157970,
        login: 'woosupar',
        is_staff: user.is_staff,
        iat: user.iat,
        ext: user.ext,
        image_url: user.image_url,
        email: user.email,
      };
    } else {
      jwtPayload = { ...user };
    }

    const token = this.jwtService.sign(jwtPayload);

    const host = request.headers.host;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, ...words] = host.split('.');
    const domain = words.join('.');
    // NOTE: JWT token의 만료시간을 직접 가져옴.
    const expires = new Date(this.jwtService.decode(token)['exp'] * 1000);
    const cookieOptions = {
      expires,
      httpOnly: false,
      domain,
    };
    this.logger.debug(`token : ${token}`);
    this.logger.debug(`cookieOptions : ${cookieOptions}`);
    response.cookie('accessToken', token, cookieOptions);
    return true;
  }
}

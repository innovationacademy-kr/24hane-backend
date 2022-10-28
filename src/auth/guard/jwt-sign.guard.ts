import { Request, Response } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { UserSessionDto } from 'src/auth/dto/user.session.dto';
import { ConfigService } from '@nestjs/config';

/**
 * 사용자 정보를 이용해 JWT 토큰을 발급하여 쿠키에 삽입하는 가드입니다.
 */
@Injectable()
export class JWTSignGuard implements CanActivate {
  private logger = new Logger(JWTSignGuard.name);

  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

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
      this.logger.debug(`can't generate JWTToken`);
      return false;
    }
    const token = this.jwtService.sign(user);
    // FIXME: CORS과 쿠키 타겟 uri를 공통으로 묶을 방법을 고안해야 함.
    const cors = this.configService.get<string>('frontend.uri');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, ...words] = cors.split('.');
    const domain = words.join('.');
    const cookieOptions = {
      httpOnly: false,
      domain,
    };
    response.cookie('accessToken', token, cookieOptions);
    return true;
  }
}

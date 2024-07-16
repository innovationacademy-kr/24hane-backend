import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

  constructor(
    private jwtService: JwtService,
    @Inject(ConfigService)
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    return this.generateJWTToken(req, res);
  }

  private async generateJWTToken(
    request: Request,
    response: Response,
  ): Promise<boolean> {
    const user = request.user as UserSessionDto | undefined;
    if (user === undefined) {
      this.logger.error(`can't generate JWTToken`);
      return false;
    }

    const accessExpiresIn = this.configService.getOrThrow<string>(
      'jwt.accessExpiresIn',
    );

    const refreshExpiresIn = this.configService.getOrThrow<string>(
      'jwt.refreshExpiresIn',
    );

    const jwtSecret = this.configService.getOrThrow<string>('jwt.secret');

    const accessToken = await this.jwtService.signAsync(user, {
      expiresIn: accessExpiresIn,
      secret: jwtSecret,
    });

    const refreshToken = await this.jwtService.signAsync(
      { ...user, type: 'refresh' },
      { expiresIn: refreshExpiresIn, secret: jwtSecret },
    );

    const host = request.headers.host;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, ...words] = host.split('.');
    const domain = words.join('.');

    // NOTE: JWT token의 만료시간을 직접 가져옴.
    const accessTokenexpires = new Date(
      (await this.jwtService.verifyAsync(accessToken)['exp']) * 1000,
    );
    const refreshTokenexpires = new Date(
      (await this.jwtService.verifyAsync(refreshToken)['exp']) * 1000,
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

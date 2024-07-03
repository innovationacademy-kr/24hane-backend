import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserSessionDto } from '../dto/user.session.dto';

/**
 * 관리자용 passport-jwt Strategy
 * Bearer token 사용
 */
@Injectable()
export class AuthAdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: UserSessionDto) {
    if (payload.is_staff !== true) {
      return false;
    }
    return payload;
  }
}

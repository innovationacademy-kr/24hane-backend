import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserSessionDto } from '../dto/user.session.dto';

/**
 * 일반 사용자용 passport-jwt Strategy
 * Bearer token 사용
 */
@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'auth') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: UserSessionDto) {
    return payload;
  }
}

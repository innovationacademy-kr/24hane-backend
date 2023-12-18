import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * 외부 API용 passport-jwt Strategy
 * Bearer token 사용
 */
@Injectable()
export class AuthExternalStrategy extends PassportStrategy(Strategy, 'ext') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: any) {
    if (payload.extfunc === 'Where42' || payload.extfunc === 'Cabi42') {
      return payload;
    }

    return false;
  }
}

import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserSessionDto } from '../dto/user.session.dto';
import { Request } from 'express';

// URI Query에서 세션 토큰을 가져옴
const extracter = (req: Request) => {
  let token = null;
  if (req && req.query && req.query.session) {
    token = req.query.session;
  }
  return token;
};

/**
 * 관리자용 passport-jwt Strategy
 * URI Query의 session 필드 사용
 */
@Injectable()
export class AuthAdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: extracter,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: UserSessionDto) {
    if (payload.is_staff !== true) {
      return false;
    }
    return payload;
  }
}

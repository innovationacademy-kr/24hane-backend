import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UserSessionDto } from '../dto/user.session.dto';
import { IAuthRepository } from '../repository/auth.repository.interface';

/**
 * passport-42 Strategy
 * 생성자의 profileFields 필드를 통해 로그인 한 사용자의 profile을 선택적으로 가져올 수 있습니다.
 * value는 가져올 필드의 키 name이며 key는 그 값을 저장할 키 name이 됩니다.
 * 예를 들어 스태프 여부를 나타내는 필드는 42에서 'staff?' 로 제공되며
 * profileFields을 통해 이를 is_staff 라는 이름으로 저장합니다.
 */
@Injectable()
export class FtOAuthStrategy extends PassportStrategy(Strategy, '42-oauth2') {
  constructor(
    @Inject('IAuthRepository') private authRepository: IAuthRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('ftAuth.clientid'),
      clientSecret: configService.get('ftAuth.secret'),
      callbackURL: configService.get('ftAuth.callbackuri'),
      passReqToCallback: true,
      profileFields: {
        user_id: 'id',
        email: 'email',
        login: 'login',
        image_url: 'image.link',
        is_staff: 'staff?',
      },
    });
  }

  /**
   * 42 OAuth 이후 이 정보를 서버 내에서 검증할 때 사용되는 함수이지만
   * 별도로 서버 내에 존재하는지 여부는 검사하지 않으며 존재하지 않으면 유저 테이블에 유저를 추가합니다.
   * profile을 전부 콜백함수에 인자로 넘기면 너무 비대하므로 필드를 선택적으로 넘깁니다.
   */
  async validate(req, at, rt, profile, cb) {
    const user: UserSessionDto = {
      user_id: profile.user_id,
      email: profile.email,
      login: profile.login,
      image_url: profile.image_url,
      is_staff: profile.is_staff,
    };
    await this.authRepository.addUserIfNotExists(user);
    cb(null, user);
  }
}

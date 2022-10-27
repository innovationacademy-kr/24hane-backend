import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 일반 사용자의 로그인 여부를 체크하는 guard입니다.
 */
@Injectable()
export class UserAuthGuard extends AuthGuard('auth') {}

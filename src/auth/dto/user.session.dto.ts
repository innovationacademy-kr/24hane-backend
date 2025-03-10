import { UserDto } from './user.dto';

/**
 * 유저 세션을 저장
 * @extends UserDto
 */
export class UserSessionDto extends UserDto {
  iat?: number; // JWT 발급 시간
  ext?: number; // JWT 만료 시간
  image_url?: string; // 42 프로필 이미지 URI
  email: string; // 42 이메일
}

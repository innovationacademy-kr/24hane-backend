export class UserSessionDto {
  /**
   * 42 계정 고유 ID
   */
  userId: number;

  /**
   * 42 이메일
   */
  email: string;

  /**
   * 42 로그인 ID
   */
  login: string;

  /**
   * 42 프로필 이미지 URI
   */
  image_url: string;

  /**
   * 스태프 여부
   */
  is_staff: boolean;
}

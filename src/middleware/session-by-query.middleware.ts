import { Middleware } from './middleware';

/**
 * URI 쿼리에 session이 있는 경우 해당 값을 쿠키의 session에 강제로 덮어씌웁니다.
 * 해당 라이브러리는 cookie-parser에 의존적입니다.
 * doosoo님의 요청으로 구글독스를 이용해 동작을 스크립트화할 때 쿠키에 세션을 담기 어려운 부분이 있기에 만들었습니다.
 *
 * @param req 요청 객체
 * @param _res 응답 객체 (미사용)
 * @param next 다음 실행할 함수
 */
export const SessionByQuery: Middleware = async (req, _res, next) => {
  const session = req.query?.session;
  if (session) {
    req.cookies['session'] = session;
  }
  next();
};

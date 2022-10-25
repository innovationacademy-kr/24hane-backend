import { Middleware } from './middleware';

/**
 * URI의 쿼리에 redirect이 설정되어 있을 경우 redirect라는 이름으로 리다이렉트 경로를 설정합니다.
 */
export const SetRedirectMiddleware: Middleware = async (req, res, next) => {
  const redirect = req.query.redirect;
  if (typeof redirect === 'string') {
    res.cookie('redirect', decodeURIComponent(redirect));
  }
  next();
};

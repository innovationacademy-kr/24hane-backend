import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { Middleware } from './middleware';
import { SessionByQuery } from './session-by-query.middleware';
import { SetRedirectMiddleware } from './set-redirect.middleware';

@Injectable()
export class SessionMiddleware {
  expressSession: Middleware;
  passportInit: Middleware;
  passportSession: Middleware;
  cookieParser: Middleware;
  sessionByQuery: Middleware;
  SetRedirectMiddleware: Middleware;

  constructor(private configService: ConfigService) {
    this.expressSession = session({
      secret: this.configService.get('authkey'),
      resave: false,
      saveUninitialized: true,
      name: 'session',
      cookie: {
        domain: this.configService.get('cookie.domain'),
      },
    });
    this.passportInit = passport.initialize();
    this.passportSession = passport.session();
    this.cookieParser = cookieParser();
    this.sessionByQuery = SessionByQuery;
    this.SetRedirectMiddleware = SetRedirectMiddleware;
  }
}

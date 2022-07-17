import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as passport from 'passport';

type Middleware = (req: any, res: any, next: (error?: any) => void) => void;

@Injectable()
export class SessionMiddleware {
  expressSession: Middleware;
  passportInit: Middleware;
  passportSession: Middleware;

  constructor(private configService: ConfigService) {
    this.expressSession = session({
      secret: this.configService.get('authkey'),
      resave: false,
      saveUninitialized: true,
    });
    this.passportInit = passport.initialize();
    this.passportSession = passport.session();
  }
}

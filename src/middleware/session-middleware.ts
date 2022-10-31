import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Middleware } from './middleware';
import { SetRedirectMiddleware } from './set-redirect.middleware';

@Injectable()
export class SessionMiddleware {
  cookieParser: Middleware;
  SetRedirectMiddleware: Middleware;

  constructor(private configService: ConfigService) {
    this.cookieParser = cookieParser();
    this.SetRedirectMiddleware = SetRedirectMiddleware;
  }
}

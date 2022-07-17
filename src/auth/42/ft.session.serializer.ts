import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class FtSessionSerializer extends PassportSerializer {
  constructor() {
    super();
  }

  serializeUser(user: any, done) {
    done(null, user);
  }

  async deserializeUser(payload: any, done) {
    try {
      const userInfo = payload;
      done(null, userInfo);
    } catch (err) {
      done(err);
    }
  }
}

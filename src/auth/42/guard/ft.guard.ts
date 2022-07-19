import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FtGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const redirect = context.switchToHttp().getRequest().query.redirect;
    if (redirect) {
      context
        .switchToHttp()
        .getResponse()
        .cookie('redirect', decodeURIComponent(redirect));
    }

    const result: boolean = (await super.canActivate(context)) as boolean;
    await super.logIn(context.switchToHttp().getRequest());
    return result;
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new UnauthorizedException({ err, info });
    }
    return user;
  }
}

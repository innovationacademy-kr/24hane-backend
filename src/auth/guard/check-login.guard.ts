import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CheckLogin implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.switchToHttp().getRequest().isAuthenticated()) {
      return true;
    }
    throw new HttpException('로그인이 필요합니다.', 401);
  }
}

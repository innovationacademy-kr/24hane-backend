import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';
import { FtGuard } from './42/guard/ft.guard';

@Controller('user/login')
export class Auth42Controller {
  @Get('42')
  @UseGuards(FtGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ftlogin() {}

  @Get('callback/42')
  @UseGuards(FtGuard)
  @Redirect('/', 302)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ftcallback() {}
}

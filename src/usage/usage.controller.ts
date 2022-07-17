import {
  Controller,
  Get,
  Logger,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CheckLogin } from 'src/auth/guard/check-login.guard';
import { User } from 'src/auth/user.decorator';
import { UsageResponseDto } from './dto/usage-response.dto';
import { UsageService } from './usage.service';

@Controller('usage')
export class UsageController {
  private logger = new Logger(UsageController.name);

  constructor(private usageService: UsageService) {}

  @Get('perday')
  @UseGuards(CheckLogin)
  async getPerDay(
    @User(new ValidationPipe({ validateCustomDecorators: true })) user: any,
  ): Promise<UsageResponseDto> {
    this.logger.debug(`call getPerDay request by ${user.login}`);
    const userId = user.login;
    const date = new Date();
    const perday = await this.usageService.getPerDay(userId, date);
    const latest = await this.usageService.getLatestDataById(userId);
    return {
      userId: user.login,
      profile: user.image_url,
      state: latest.inout,
      ...perday,
    };
  }

  @Get('perweek')
  @UseGuards(CheckLogin)
  async getPerWeek(
    @User(new ValidationPipe({ validateCustomDecorators: true })) user: any,
  ): Promise<UsageResponseDto> {
    this.logger.debug(`call getPerWeek request by ${user.login}`);
    const userId = user.login;
    const date = new Date();
    const perweek = await this.usageService.getPerWeek(userId, date);
    const latest = await this.usageService.getLatestDataById(userId);
    return {
      userId: user.login,
      profile: user.image_url,
      state: latest.inout,
      ...perweek,
    };
  }

  @Get('permonth')
  @UseGuards(CheckLogin)
  async getPerMonth(
    @User(new ValidationPipe({ validateCustomDecorators: true })) user: any,
  ): Promise<UsageResponseDto> {
    this.logger.debug(`call getPerMonth request by ${user.login}`);
    const userId = user.login;
    const date = new Date();
    const permonth = await this.usageService.getPerMonth(userId, date);
    const latest = await this.usageService.getLatestDataById(userId);
    return {
      userId: user.login,
      profile: user.image_url,
      state: latest.inout,
      ...permonth,
    };
  }
}

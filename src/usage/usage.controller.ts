import { Controller, Get, Logger } from '@nestjs/common';
import { UsageService } from './usage.service';

@Controller('usage')
export class UsageController {
  private logger = new Logger(UsageController.name);

  constructor(private usageService: UsageService) {}

  @Get('perday')
  async getPerDay() {
    this.logger.debug('call getPerDay request');
    const userId = 'joopark'; // TODO: remove
    const date = new Date();
    return await this.usageService.getPerDay(userId, date);
  }

  @Get('perweek')
  async getPerWeek() {
    this.logger.debug('call getPerDay request');
    const userId = 'joopark'; // TODO: remove
    const date = new Date();
    return await this.usageService.getPerWeek(userId, date);
  }

  @Get('permonth')
  async getPerMonth() {
    this.logger.debug('call getPerDay request');
    const userId = 'joopark'; // TODO: remove
    const date = new Date();
    return await this.usageService.getPerMonth(userId, date);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedirectService {
  private logger = new Logger(RedirectService.name);

  constructor(private configService: ConfigService) {}

  async moneyGuidelines(): Promise<string> {
    return this.configService.getOrThrow<string>('redirect.money_guidelines');
  }

  async question(): Promise<string> {
    return this.configService.getOrThrow<string>('redirect.question');
  }

  async usage(): Promise<string> {
    return this.configService.getOrThrow<string>('redirect.usage');
  }

  async feedback(): Promise<string> {
    return this.configService.getOrThrow<string>('redirect.feedback');
  }

  async terms(): Promise<string> {
    return this.configService.getOrThrow<string>('redirect.terms');
  }

  async reissuance_guidelines(): Promise<string> {
    return this.configService.getOrThrow<string>(
      'redirect.reissuance_guidelines',
    );
  }
}

import { Module } from '@nestjs/common';
import { WebhookModule } from './webhook/webhook.module.e2e-spec';

@Module({
  imports: [WebhookModule],
})
export class AppModule {}

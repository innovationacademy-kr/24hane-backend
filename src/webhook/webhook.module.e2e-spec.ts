import { Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inout } from 'src/entities/inout.entity';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import MockWebhookRepository from './repository/mock/mock.webhook.repository';

const repositories = [
  {
    provide: getRepositoryToken(Inout),
    useClass: MockWebhookRepository,
  },
];

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, ...repositories],
})
export class WebhookModule {}

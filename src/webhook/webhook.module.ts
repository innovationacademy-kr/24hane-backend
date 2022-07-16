import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inout } from 'src/entities/inout.entity';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inout])],
  exports: [TypeOrmModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}

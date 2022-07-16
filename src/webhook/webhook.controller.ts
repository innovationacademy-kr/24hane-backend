import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WebhookRequestDto } from './dto/webhook-request.dto';
import { WebhookService } from './webhook.service';

@Controller('webhook')
@UsePipes(new ValidationPipe({ transform: true }))
export class WebhookController {
  private logger = new Logger(WebhookController.name);

  constructor(private webhookService: WebhookService) {}

  @Post('/')
  async AddInOut(@Body() webhookReq: WebhookRequestDto): Promise<void> {
    this.logger.debug('call webhook request');
    this.webhookService.addInOutData(webhookReq);
  }
}

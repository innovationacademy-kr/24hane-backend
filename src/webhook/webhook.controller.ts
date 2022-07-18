import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WebhookRequestDto } from './dto/webhook-request.dto';
import { WebhookService } from './webhook.service';

@ApiTags('웹훅 API')
@Controller('webhook')
@UsePipes(new ValidationPipe({ transform: true }))
export class WebhookController {
  private logger = new Logger(WebhookController.name);

  constructor(private webhookService: WebhookService) {}

  @ApiOperation({
    summary: '웹훅 수신',
    description: '웹훅을 통해 클러스터 입퇴장 여부를 기록합니다.',
  })
  @ApiResponse({ status: 201, description: '기록 추가 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @Post('/')
  async AddInOut(@Body() webhookReq: WebhookRequestDto): Promise<void> {
    this.logger.debug('call webhook request');
    this.webhookService.addInOutData(webhookReq);
  }
}

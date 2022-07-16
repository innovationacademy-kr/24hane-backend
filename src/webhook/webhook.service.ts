import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inout } from 'src/entities/inout.entity';
import { WebhookRequestDto } from './dto/webhook-request.dto';

@Injectable()
export class WebhookService {
  private logger = new Logger(WebhookService.name);

  constructor(
    @InjectRepository(Inout)
    private webhookRepository: Repository<Inout>,
  ) {}

  /**
   * 입출입 기록을 저장합니다.
   */
  async addInOutData(data: WebhookRequestDto): Promise<void> {
    await this.webhookRepository.insert({
      intra_id: data.intraId,
      timestamp: data.timestamp,
      inout: data.inout,
      cluster: data.cluster,
    });
  }
}

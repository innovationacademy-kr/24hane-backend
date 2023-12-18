import { Injectable } from '@nestjs/common';
import { InfoMessageDto } from 'src/tag-log/dto/info-message.dto';

@Injectable()
export class MessageGenerator {
  // private logger = new Logger(MessageGenerator.name);

  private generateFundInfoMessage(): InfoMessageDto {
    const INFO_MESSAGE_TITLE: string =
      '인정 시간은 지원금 산정 시\n반영되는 시간입니다.';
    const INFO_MESSAGE_CONTENT: string = '1일 최대 12시간';
    const infoMessage = new InfoMessageDto(
      INFO_MESSAGE_TITLE,
      INFO_MESSAGE_CONTENT,
    );
    return infoMessage;
  }

  private generateTagLatencyMessage(): InfoMessageDto {
    const INFO_MESSAGE_TITLE: string =
      '입실 중 이용시간은\n실제 기록과 다를 수 있습니다.';
    const INFO_MESSAGE_CONTENT: string = '입실 / 퇴실 태깅에 유의해주세요.';
    const infoMessage = new InfoMessageDto(
      INFO_MESSAGE_TITLE,
      INFO_MESSAGE_CONTENT,
    );
    return infoMessage;
  }

  generateInfoMessages(): Record<string, InfoMessageDto> {
    const infoMessages: Record<string, InfoMessageDto> = {};
    infoMessages['fundInfoNotice'] = this.generateFundInfoMessage();
    infoMessages['tagLatencyNotice'] = this.generateTagLatencyMessage();
    return infoMessages;
  }
}

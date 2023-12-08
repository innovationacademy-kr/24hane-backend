import { Injectable, Logger } from "@nestjs/common";
import { InfoMessageDto } from "src/tag-log-v3/dto/info-message.dto";

@Injectable()
export class MessageGenerator {
    // private logger = new Logger(MessageGenerator.name);

    generateInfoMessage(): InfoMessageDto {
        const INFO_MESSAGE_TITLE: string =  "인정 시간은 지원금 정책에 반영되는 시간입니다.";
        const INFO_MESSAGE_CONTENT: string = "1일 최대 12시간";
        const infoMessage = new InfoMessageDto(INFO_MESSAGE_TITLE, INFO_MESSAGE_CONTENT);
        return infoMessage;
    }
        
}
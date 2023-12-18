import { Module } from '@nestjs/common';
import { MessageGenerator } from './message-generator.component';

@Module({
  providers: [MessageGenerator],
  exports: [MessageGenerator],
})
export class MessageGeneratorModule {}

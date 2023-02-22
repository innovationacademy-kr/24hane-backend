import { Module } from '@nestjs/common';
import { ReissueService } from './reissue.service';
import { ReissueController } from './reissue.controller';

@Module({
  controllers: [ReissueController],
  providers: [ReissueService],
  exports: [ReissueService],
})
export class ReissueModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagLogController } from './tag-log.controller';
@Module({
  //imports: [TypeOrmModule.forFeature([])],
  //exports: [TypeOrmModule],
  controllers: [TagLogController],
  //providers: [UsageService],
})
export class TagLogModule {}

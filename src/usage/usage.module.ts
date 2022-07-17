import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inout } from 'src/entities/inout.entity';
import { UsageController } from './usage.controller';
import { UsageService } from './usage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inout])],
  exports: [TypeOrmModule],
  controllers: [UsageController],
  providers: [UsageService],
})
export class UsageModule {}

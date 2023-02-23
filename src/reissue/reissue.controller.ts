import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/auth/guard/user-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserSessionDto } from '../auth/dto/user.session.dto';
import { ReissueService } from './reissue.service';

@ApiTags('카드 재발급 신청/신청 내역 확인')
@Controller({
  version: '1',
  path: 'reissue',
})
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
export class ReissueController {
  constructor(private reissueService: ReissueService) {}

  @Get()
  async getReissueState(@User() user: UserSessionDto): Promise<string> {
    const result = await this.reissueService.getReissueState(user.user_id);
    return result;
  }
  @Post('request')
  async reissueRequest(@User() user: UserSessionDto): Promise<void> {
    const result = await this.reissueService.reissueRequest(user);
    console.log(result);
  }
}

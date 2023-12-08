import { Injectable, Logger } from '@nestjs/common';
import { TagLogService } from 'src/tag-log-v2/tag-log-v2.service';
import { UserService } from 'src/user/user.service';
import { Cabi42ResponseDto } from './dto/cabi42.response.dto';

@Injectable()
export class Cabi42Service {
  private logger = new Logger(Cabi42Service.name);

  constructor(
    private userService: UserService,
    private tagLogService: TagLogService,
  ) {}

  async cabi42(year: number, month: number): Promise<Cabi42ResponseDto[]> {
    this.logger.debug(`@cabi42) check all user of ${year}-${month}`);
    // admin을 제외한 모든 유저
    const cadets = await this.userService.getAllIds(false);

    return await Promise.all(
      cadets.map((cadet) =>
        this.getAccumulationInMonthById(
          cadet.user_id,
          cadet.login,
          year,
          month,
        ),
      ),
    );
  }

  async findIdByLogin(login: string): Promise<number> {
    this.logger.debug(`@findIdByLogin) ${login}`);
    return this.userService.findIdByLogin(login);
  }

  async getAccumulationInMonthById(
    id: number,
    login: string,
    year: number,
    month: number,
  ): Promise<Cabi42ResponseDto> {
    this.logger.debug(
      `@cabi42) check user: ${login}(${id}) of ${year}-${month}`,
    );
    const date = new Date(`${year}-${month}`);
    const resultMonth = await this.tagLogService.getAllTagPerMonth(id, date);
    const monthAccumationTime = resultMonth.reduce(
      (prev, result) => result.durationSecond + prev,
      0,
    );
    return {
      id,
      login,
      monthAccumationTime,
    };
  }
}

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TagLogAdminService } from 'src/tag-log/tag-log-admin.service';
import { TagLogService } from 'src/tag-log/tag-log.service';
import { UserService } from 'src/user/user.service';
import { Cabi42ResponseDto } from './dto/cabi42.response.dto';

@Injectable()
export class Cabi42Service {
  private logger = new Logger(Cabi42Service.name);

  constructor(
    private userService: UserService,
    private tagLogService: TagLogService,
    private tagLogAdminService: TagLogAdminService,
  ) {}

  /**
   * For removal in 5.0.0
   */
  async cabi42ByLogin(
    year: number,
    month: number,
    login: string,
  ): Promise<Cabi42ResponseDto[]> {
    const logins: string[] = login.split(',');

    const results: Cabi42ResponseDto[] = [];

    await Promise.all(
      logins.map(async (login) => {
        const id = await this.tagLogAdminService.findIdByLogin(login);
        if (id < 0) {
          throw new BadRequestException({
            message: `${login}은 서버상에 존재하지 않는 login ID입니다.`,
          });
        }

        const result = await this.tagLogAdminService.getAccumulationInMonthById(
          id,
          login,
          year,
          month,
        );
        results.push(result);
      }),
    );

    return results;
  }

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

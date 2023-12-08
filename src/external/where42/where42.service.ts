import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ITagLogRepository } from 'src/tag-log-v1/repository/interface/tag-log-repository.interface';
import { UserService } from 'src/user/user.service';
import { Where42ResponseDto } from './dto/where42.response.dto';
import { IDeviceInfoRepository } from './repository/interface/device-info.repository.interface';

@Injectable()
export class Where42Service {
  private logger = new Logger(Where42Service.name);

  constructor(
    private userService: UserService,
    @Inject('IDeviceInfoRepository')
    private deviceInfoRepository: IDeviceInfoRepository,
    @Inject('ITagLogRepository')
    private tagLogRepository: ITagLogRepository,
  ) {}

  async where42(login: string): Promise<Where42ResponseDto> {
    this.logger.debug(`@where42) check ${login}`);
    // 존재하는 유저인지 체크
    const user_id = await this.userService.findIdByLogin(login);

    if (user_id === -1) {
      throw new BadRequestException('존재하지 않는 유저 ID입니다.');
    }

    const cards = await this.userService.findCardsByUserId(
      user_id,
      new Date('2019-01-01 00:00:00'),
      new Date(), // NOTE: 대략 42 클러스터 오픈일부터 지금까지 조회
    );
    const last = await this.tagLogRepository.findLatestTagLog(cards);
    if (last === null) {
      throw new ForbiddenException('태그 기록이 존재하지 않습니다.');
    }
    const device = await this.deviceInfoRepository.getDeviceInfo(
      last.device_id,
    );
    if (device === null) {
      throw new ForbiddenException(
        '등록되지 않은 기기에 태그하였습니다. 관리자에게 문의하세요.',
      );
    }
    return {
      login,
      inoutState: device.inoutState,
      cluster: device.cluster,
      tag_at: last.tag_at,
    };
  }
}

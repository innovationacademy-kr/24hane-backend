import { Inject, Injectable, Logger } from '@nestjs/common';
import { TagLog } from 'src/entities/tag-log.entity';
import { IPairInfoRepository } from './repository/interface/pair-info-repository.interface';
import { ITagLogRepository } from './repository/interface/tag-log-repository.interface';
import { IUserInfoRepository } from './repository/interface/user-info-repository.interface';

@Injectable()
export class TagLogService {
  private logger = new Logger(TagLogService.name);

  constructor(
    @Inject('IUserInfoRepository')
    private userInfoRepository: IUserInfoRepository,
    @Inject('ITagLogRepository')
    private tagLogRepository: ITagLogRepository,
    @Inject('IPairInfoRepository')
    private pairInfoRepository: IPairInfoRepository,
  ) {}

  /**
   * 사용자 ID로 사용자에 대한 카드 ID 목록을 반환합니다.
   *
   * @param userId 사용자 아이디
   * @param vaildEnd 최소 만료기간 (optional)
   * @param vaildStart 카드 발급한 기간보다 작은 기간 (optional)
   * @returns 카드 ID 목록 (배열)
   */
  async getCardIdsByUserId(
    userId: number,
    vaildEnd?: Date,
    vaildStart?: Date,
  ): Promise<string[]> {
    return this.userInfoRepository.findCardIds(userId, vaildEnd, vaildStart);
  }

  async getPair() {
    const pairs = await this.pairInfoRepository.findAll();
    console.log(pairs);
  }

  async getTagLogs(cardIDs: string[]): Promise<TagLog[]> {
    return this.tagLogRepository.findTagLogs(
      cardIDs,
      new Date('2022-07-31T16:02:32.000Z'),
      new Date('2099-09-09'),
    );
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { TagLogDto } from 'src/tag-log-v1/dto/tag-log.dto';
import { ITagLogRepository } from '../interface/tag-log-repository.interface';
import { Repository, In, Between, LessThan, MoreThan } from 'typeorm';
import { TagLog } from 'src/entities/tag-log.entity';

export class TagLogRepository implements ITagLogRepository {
  constructor(
    @InjectRepository(TagLog)
    private tagLogRepository: Repository<TagLog>,
  ) {}

  async findTagLogs(
    cardIDs: string[],
    start: Date,
    end: Date,
  ): Promise<TagLogDto[]> {
    const result = await this.tagLogRepository.find({
      where: {
        card_id: In(cardIDs),
        tag_at: Between(start, end),
      },
      order: {
        tag_at: 'ASC',
      },
    });
    return result;
  }

  async findLatestTagLog(cardIDs: string[]): Promise<TagLogDto | null> {
    const result = await this.tagLogRepository.findOne({
      where: {
        card_id: In(cardIDs),
      },
      order: {
        tag_at: 'DESC',
      },
    });
    return result;
  }

  async findFirstTagLog(cardIDs: string[]): Promise<TagLogDto | null> {
    const result = await this.tagLogRepository.findOne({
      where: {
        card_id: In(cardIDs),
      },
      order: {
        tag_at: 'ASC',
      },
    });
    return result;
  }

  async findPrevTagLog(
    cardIDs: string[],
    idx: number,
  ): Promise<TagLogDto | null> {
    const result = await this.tagLogRepository.findOne({
      where: {
        card_id: In(cardIDs),
        idx: LessThan(idx),
      },
      order: {
        idx: 'DESC',
      },
    });
    return result;
  }

  async findNextTagLog(
    cardIDs: string[],
    idx: number,
  ): Promise<TagLogDto | null> {
    const result = await this.tagLogRepository.findOne({
      where: {
        card_id: In(cardIDs),
        idx: MoreThan(idx),
      },
      order: {
        idx: 'ASC',
      },
    });
    return result;
  }
}

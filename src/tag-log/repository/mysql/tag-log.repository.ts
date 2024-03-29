import { InjectRepository } from '@nestjs/typeorm';
import { TagLog } from 'src/entities/tag-log.entity';
import { TagLogDto } from 'src/tag-log/dto/tag-log.dto';
import { CardDto } from 'src/user/dto/card.dto';
import { Between, In, LessThan, MoreThan, Repository } from 'typeorm';
import { ITagLogRepository } from '../interface/tag-log-repository.interface';

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

  async findTagLogsByCards(
    cards: CardDto[],
    start: Date,
    end: Date,
  ): Promise<TagLogDto[]> {
    const querys = cards.map((card) => {
      const search_start = start < card.begin ? card.begin : start;
      const search_end = end < card.end ? end : card.end;
      return this.tagLogRepository.find({
        where: {
          card_id: card.card_id,
          tag_at: Between(search_start, search_end),
        },
        order: {
          tag_at: 'ASC',
        },
      });
    });
    const result = await Promise.all(querys);
    return result.reduce((prev, next) => prev.concat(next), []);
  }

  async findLatestTagLog(cards: CardDto[]): Promise<TagLogDto | null> {
    if (cards.length === 0) {
      return null;
    }
    const wheres = cards.map((card) => ({
      card_id: card.card_id,
      tag_at: Between(card.begin, card.end),
    }));
    const result = await this.tagLogRepository.findOne({
      where: wheres,
      order: {
        tag_at: 'DESC',
      },
    });
    return result;
  }

  async findFirstTagLog(cards: CardDto[]): Promise<TagLogDto | null> {
    if (cards.length === 0) {
      return null;
    }
    const wheres = cards.map((card) => ({
      card_id: card.card_id,
      tag_at: Between(card.begin, card.end),
    }));
    const result = await this.tagLogRepository.findOne({
      where: wheres,
      order: {
        tag_at: 'ASC',
      },
    });
    return result;
  }

  async findPrevTagLog(cardID: CardDto, date: Date): Promise<TagLogDto | null> {
    const result = await this.tagLogRepository.findOne({
      where: {
        card_id: cardID.card_id,
        tag_at: LessThan(date),
      },
      order: {
        idx: 'DESC',
      },
    });
    if (result && cardID.begin.getTime() > result.tag_at.getTime()) {
      return null;
    }
    return result;
  }

  async findNextTagLog(cardID: CardDto, date: Date): Promise<TagLogDto | null> {
    const result = await this.tagLogRepository.findOne({
      where: {
        card_id: cardID.card_id,
        tag_at: MoreThan(date),
      },
      order: {
        idx: 'ASC',
      },
    });
    if (result && cardID.end.getTime() < result.tag_at.getTime()) {
      return null;
    }
    return result;
  }
}

import { IUserCardRepository } from '../interface/user-card-no.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/user-info.entity';
import { Repository } from 'typeorm/repository/Repository';


export class UserCardRepository implements IUserCardRepository {
    constructor(
        @InjectRepository(UserInfo)
        private userInfoRepository: Repository<UserInfo>,
      ) {}
      
    async findInitialCardByUserId(user_id: number): Promise<string[]> {
        const result = await this.userInfoRepository.findOne({
            relations: {
              cardIssuance: true,
            },
            where: {
              user_id: user_id,
            },
          });
        if (!result) {
          return [];
        }
        return result.cardIssuance.map((card) => card.card_id);
    }
}
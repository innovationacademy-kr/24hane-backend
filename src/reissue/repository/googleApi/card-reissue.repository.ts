import { auth, sheets } from '@googleapis/sheets';
import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CardReissue } from 'src/entities/card-reissue.entity';
import { ICardReissueRepository } from '../interface/card-reissue.repository.interface';

export class CardReissueRepository implements ICardReissueRepository {
  private logger = new Logger(CardReissueRepository.name);

  gsKey: string;
  gsEmail: string;
  gsRange: string;
  gsSheetId: string;
  gsScope: string[];

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    this.gsScope = ['https://www.googleapis.com/auth/spreadsheets'];
    this.gsKey = this.configService.get<string>('googleCardApi.key');
    this.gsEmail = this.configService.get<string>('googleCardApi.email');
    this.gsRange = this.configService.get<string>('googleCardApi.range');
    this.gsSheetId = this.configService.get<string>(
      'googleCardApi.spreadsheetId',
    );
  }

  private convToKST(date: Date): string {
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const requestedAt = new Date(date.getTime() + KR_TIME_DIFF)
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');
    return requestedAt;
  }

  private authorize(): any {
    const googleAuth = new auth.JWT({
      email: this.gsEmail,
      key: this.gsKey,
      scopes: this.gsScope,
    });
    return googleAuth;
  }

  async findByUserId(user_id: number): Promise<CardReissue[]> {
    const auth = this.authorize();
    let result = [];
    try {
      const sheet = sheets('v4');
      const allCardReissues = await sheet.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: this.gsSheetId,
        range: this.gsRange,
      });
      result = allCardReissues.data.values;
    } catch (e) {
      this.logger.error(e.message);
    }
    return result
      .map((value, index) => ({
        idx: index + 1,
        user_id: value[0],
        login_id: value[1],
        apply_date: new Date(value[2]),
        requestd: !!value[3],
        issued: !!value[4],
        picked: !!value[5],
        origin_card_id: value[6] ? value[6] : '',
        new_card_id: value[7] ? value[7] : '',
      }))
      .filter((result) => result.user_id == user_id);
  }

  async save(data: CardReissue): Promise<void> {
    const auth = this.authorize();
    const option = 'RAW';
    const range = data.idx
      ? this.gsRange + `!A${data.idx}:H${data.idx}`
      : this.gsRange;
    const value = [
      data.user_id,
      data.login_id,
      this.convToKST(data.apply_date),
      data.requestd ? 'O' : '',
      data.issued ? 'O' : '',
      data.picked ? 'O' : '',
      data.origin_card_id,
      data.new_card_id,
    ];
    try {
      const sheet = sheets('v4');
      const params = {
        auth: auth,
        spreadsheetId: this.gsSheetId,
        range,
        valueInputOption: option,
        requestBody: {
          values: [value],
        },
      };
      if (data.idx) {
        await sheet.spreadsheets.values.update(params);
      } else {
        await sheet.spreadsheets.values.append(params);
      }
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}

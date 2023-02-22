import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sheets, auth } from '@googleapis/sheets';

@Injectable()
export class ReissueService {
    constructor(@Inject(ConfigService) private configService: ConfigService) {}

    async getReissueState(user_id: number): Promise<boolean> {
      let result = true;
      const envEmail = this.configService.get<string>('googleCardApi.email');
      const envKey = this.configService.get<string>('googleCardApi.key');
      const envSsid = this.configService.get<string>('googleCardApi.spreadsheetId');
      const envRange = this.configService.get<string>('googleCardApi.range');
      try {
        const googleAuth = new auth.JWT({
          email: envEmail,
          key: envKey,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheet = sheets('v4');
        const resp = (await sheet.spreadsheets.values.get({
            spreadsheetId: envSsid,
        })).data;
        console.log(resp)

      } catch (e) {
        result = false;
      }
      return result;
    }
}

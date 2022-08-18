import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

/**
 * doosoo 팀장님의 요청에 따라 Google API를 이용해서 Spread Sheet로 Data를 송부하기 위한 컴포넌트입니다.
 */
@Injectable()
export class GoogleApi {
  private logger = new Logger(GoogleApi.name);

  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  async transportData(data: string): Promise<boolean> {
    this.logger.log(`call transportData (data: ${data})`);
    let result = true;
    const envEmail = this.configService.get<string>('googleApi.email');
    const envKey = this.configService.get<string>('googleApi.key');
    const envSsid = this.configService.get<string>('googleApi.spreadsheetId');
    const envRange = this.configService.get<string>('googleApi.range');
    this.logger.log(envEmail, envKey, envSsid, envRange);
    try {
      const auth = new google.auth.JWT({
        email: envEmail,
        key: envKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const sheet = google.sheets('v4');
      await sheet.spreadsheets.values.append({
        spreadsheetId: envSsid,
        auth,
        range: envRange,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[data]],
        },
      });
    } catch (e) {
      this.logger.error(e.message);
      result = false;
    }
    return result;
  }
}

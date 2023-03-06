import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sheets, auth } from '@googleapis/sheets';

/**
 * doosoo 팀장님의 요청에 따라 Google API를 이용해서 Spread Sheet로 Data를 송부하기 위한 컴포넌트입니다.
 */
@Injectable()
export class GoogleApi {
  private logger = new Logger(GoogleApi.name);
  private _envEmail = this.configService.get<string>('googleCardApi.email');
  private _key = this.configService.get<string>('googleCardApi.key');
  private _gsId = this.configService.get<string>('googleCardApi.spreadsheetId');
  private _gsRange = this.configService.get<string>('googleCardApi.range');
  private _scope = ['https://www.googleapis.com/auth/spreadsheets'];
  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  get gsId() {
    return this._gsId;
  }
  get gsRange() {
    return this._gsRange;
  }
  async transportData(data: string): Promise<boolean> {
    this.logger.log(`call transportData (data: ${data})`);
    let result = true;
    const envEmail = this.configService.get<string>('googleApi.email');
    const envKey = this.configService.get<string>('googleApi.key');
    const envSsid = this.configService.get<string>('googleApi.spreadsheetId');
    const envRange = this.configService.get<string>('googleApi.range');
    try {
      const googleAuth = new auth.JWT({
        email: envEmail,
        key: envKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const sheet = sheets('v4');
      await sheet.spreadsheets.values.append({
        spreadsheetId: envSsid,
        auth: googleAuth,
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

  authorize(): any {
    const googleAuth = new auth.JWT({
      email: this._envEmail,
      key: this._key,
      scopes: this._scope,
    });
    return googleAuth;
  }

  async getAllValues(): Promise<any[][]> {
    const auth = this.authorize();
    let result = [];
    try {
      const sheet = sheets('v4');
      const allCardReissues = await sheet.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: this.gsId,
        range: this.gsRange,
      });
      result = allCardReissues.data.values;
    } catch (error) {
      this.logger.error(
        `@getAllValues) failed to read google sheet: ${error.message}`,
      );
      throw new ServiceUnavailableException(
        `구글스프레드 시트 조회 실패: ${error.message}`,
      );
    }
    return result;
  }

  async appendValues(data: (string | number)[]): Promise<void> {
    const auth = this.authorize();
    try {
      const sheet = sheets('v4');
      await sheet.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: this.gsId,
        range: this.gsRange,
        valueInputOption: 'RAW',
        requestBody: {
          values: [data],
        },
      });
    } catch (error) {
      this.logger.error(
        `@appendValues) failed to append to google sheet: ${error.message}`,
      );
      throw new ServiceUnavailableException(
        `카드 재발급 신청 구글스프레드 시트에 추가 실패: ${error.message}`,
      );
    }
  }

  async updateValues(rowNum: number, data: string): Promise<void> {
    const auth = this.authorize();
    try {
      const sheet = sheets('v4');
      await sheet.spreadsheets.values.update({
        auth: auth,
        spreadsheetId: this.gsId,
        range: this.gsRange + `!F${rowNum}`,
        requestBody: {
          values: [[data]],
        },
        valueInputOption: 'USER_ENTERED',
      });
    } catch (error) {
      this.logger.error(
        `@updateValues) failed to update google sheet: ${error.message}`,
      );
      throw new ServiceUnavailableException(
        `수령완료 행 구글스프레드 시트에 업데이트 실패: ${error.message}`,
      );
    }
  }
}

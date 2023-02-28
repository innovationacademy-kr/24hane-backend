import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sheets, auth } from '@googleapis/sheets';

/**
 * doosoo 팀장님의 요청에 따라 Google API를 이용해서 Spread Sheet로 Data를 송부하기 위한 컴포넌트입니다.
 */
@Injectable()
export class GoogleApi {
  private logger = new Logger(GoogleApi.name);
  private _envEmail = this.configService.get<string>('googleCardApi.email');
  private _keyFile = this.configService.get<string>('googleCardApi.key');
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
      key: this._keyFile,
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
    } catch (e) {
      this.logger.error(e.message);
    }
    return result;
  }

  async appendValues(data: (String | Number)[]): Promise<void> {
    const auth = this.authorize();
    try {
      const sheet = sheets('v4');
      const allCardReissues = await sheet.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: this.gsId,
        range: this.gsRange,
        valueInputOption: 'RAW',
        requestBody: {
          values: [data],
        },
      });
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async updateValues(rowNum: Number, data: String): Promise<void> {
    const auth = this.authorize();
    try {
      const sheet = sheets('v4');
      await sheet.spreadsheets.values.update({
        auth: auth,
        spreadsheetId: this.gsId,
        range: this.gsRange + `!E${rowNum}`,
        requestBody: {
          values: [[data]],
        },
        valueInputOption: 'USER_ENTERED',
      });
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}

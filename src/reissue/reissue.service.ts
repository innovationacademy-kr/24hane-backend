import { Inject, Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { sheets, auth } from '@googleapis/sheets';
import { google } from 'googleapis';

@Injectable()
export class ReissueService {
  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  async getReissueState(): Promise<boolean> {
    let result = true;
    const envSsid = this.configService.get<string>(
      'googleCardApi.spreadsheetId',
    );
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: 'google_credential.json', //the key file
        //url to spreadsheets API
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
      });
      // const googleAuth = new auth.JWT({
      //   email: envEmail,
      //   key: envKey,
      //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      // });
      const authClientObject = await auth.getClient();
      const googleSheetsInstance = google.sheets({
        version: 'v4',
        auth: authClientObject,
      });
      const readData = await googleSheetsInstance.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: envSsid,
        range: 'test',
      });
      console.log(readData.data);
    } catch (e) {
      result = false;
      console.log(e);
    }
    return result;
  }
}

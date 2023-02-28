import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, sheets_v4 } from 'googleapis';
import { GoogleAuth } from 'googleapis-common';

@Injectable()
export class GoogleSpreadSheetApi {
  private _keyFile = this.configService.get<string>('googleCardApi.keyFile');
  private _gsId = this.configService.get<string>('googleCardApi.spreadsheetId');
  private _gsRange = this.configService.get<string>('googleCardApi.range');
  private _scope = ['https://www.googleapis.com/auth/spreadsheets'];
  private _auth: GoogleAuth;
  constructor(
    @Inject(ConfigService)
    private configService: ConfigService,
  ) {
    this._auth = this.authorize();
  }

  get auth() {
    return this._auth;
  }
  get gsId() {
    return this._gsId;
  }
  get gsRange() {
    return this._gsRange;
  }

  authorize(): GoogleAuth {
    const auth = new google.auth.GoogleAuth({
      keyFile: this._keyFile,
      scopes: this._scope,
    });
    return auth;
  }

  async getGoogleSheetInstance(): Promise<sheets_v4.Sheets> {
    const authClient = await this.auth.getClient();
    const googleSheetsInstance = google.sheets({
      version: 'v4',
      auth: authClient,
    });
    return googleSheetsInstance;
  }

  async getAllValues(): Promise<any[][]> {
    const gs = await this.getGoogleSheetInstance();
    const allCardReissues = await gs.spreadsheets.values.get({
      auth: this.auth,
      spreadsheetId: this.gsId,
      range: this.gsRange,
    });
    const result = allCardReissues.data.values;
    return result;
  }

  async appendValues(data: (String | Number)[]): Promise<void> {
    const gs = await this.getGoogleSheetInstance();
    await gs.spreadsheets.values.append({
      auth: this.auth,
      spreadsheetId: this.gsId,
      range: this.gsRange,
      valueInputOption: 'RAW',
      requestBody: {
        values: [data],
      },
    });
  }

  async updateValues(rowNum: Number, data: String): Promise<void> {
    const gs = await this.getGoogleSheetInstance();
    await gs.spreadsheets.values.update({
      spreadsheetId: this.gsId,
      range: this.gsRange + `!E${rowNum}`,
      requestBody: {
        values: [[data]],
      },
      valueInputOption: 'USER_ENTERED',
    });
  }
}

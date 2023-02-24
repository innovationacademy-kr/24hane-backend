import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { google } from "googleapis";
import { GoogleAuth } from "googleapis-common";


@Injectable()
export class GoogleSpreadSheetApi {

  private _keyFile = this.configService.get<string>('googleCardApi.keyFile');
  private _gsId = this.configService.get<string>('googleCardApi.spreadsheetId');
  private _gsRange = this.configService.get<string>('googleCardApi.range');
  private _scope = ['https://www.googleapis.com/auth/spreadsheets'];
  private _auth: GoogleAuth;
  constructor(
    @Inject(ConfigService)
    private configService: ConfigService) {
        console.log("constructor")
        this._auth = this.authorize();
  }

  get auth() { return this._auth }
  get gsId() { return this._gsId}
  get gsRange() { return this._gsRange } 

  authorize() {
    console.log("authorize function")
    const auth = new google.auth.GoogleAuth({
        keyFile: this._keyFile,
        scopes: this._scope,
    });
    return auth
  }

  async getGoogleSheetInstance() {
    const authClient = await this.auth.getClient();
    const googleSheetsInstance = google.sheets({
        version: 'v4',
        auth: authClient,
      });
    return googleSheetsInstance
  }
}
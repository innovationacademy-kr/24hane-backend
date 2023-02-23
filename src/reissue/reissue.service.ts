import { Inject, Injectable, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { google } from 'googleapis';
import { UserSessionDto } from '../auth/dto/user.session.dto';
import { IUserCardRepository } from './repository/interface/user-card-no.repository.interface';

@Injectable()
export class ReissueService {
  constructor(
    @Inject(ConfigService)
    private configService: ConfigService,
    @Inject('IUserCardRepository')
    private UserCardRepository: IUserCardRepository,
  ) {}

  async getReissueState(user_id: number): Promise<string> {
    const envSsid = this.configService.get<string>(
      'googleCardApi.spreadsheetId',
    );
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: 'google_credential.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
      });
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

      const result = readData.data.values;
      const filtered = [];
      for (const row of result) {
        if (row[0] == user_id) {
          filtered.push(row);
        }
      }
      console.log(filtered);
      const recent = filtered.pop();
      const isIssued = recent[3];
      const isPickedUp = recent[4];
      let state = '';
      if (isIssued) {
        if (isPickedUp) {
          state = 'done';
        } else {
          state = 'pick up requested';
        }
      } else {
        state = 'in_progress';
      }
      return state;
    } catch (e) {
      console.log(e);
    }
  }

  async reissueRequest(user: UserSessionDto): Promise<void> {
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const requestedAt = new Date(Date.now() + KR_TIME_DIFF)
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');
    const initialCardNo = (
      await this.UserCardRepository.findInitialCardByUserId(user.user_id)
    ).pop();

    const envSsid = this.configService.get<string>(
      'googleCardApi.spreadsheetId',
    );
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: 'google_credential.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
      });
      const authClientObject = await auth.getClient();
      const googleSheetsInstance = google.sheets({
        version: 'v4',
        auth: authClientObject,
      });
      console.log(typeof initialCardNo);
      console.log(initialCardNo);
      const data = [
        user.user_id,
        user.login,
        requestedAt,
        '',
        '',
        initialCardNo,
      ];
      const readData = await googleSheetsInstance.spreadsheets.values.append({
        spreadsheetId: envSsid,
        auth: auth,
        range: 'test',
        valueInputOption: 'RAW',
        requestBody: {
          values: [data],
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
      const data = {
        login: user.login,
        initial_card_no: initialCardNo,
        requested_at: requestedAt,
      };
      axios
        .post('jandi_url', data)
        // .then(function (response) {
        //   console.log(response);
        // })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
}

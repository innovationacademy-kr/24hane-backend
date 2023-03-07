export class CardReissue {
  idx: number | undefined;
  user_id: number;
  login_id: string;
  apply_date: Date;
  requestd: boolean;
  issued: boolean;
  picked: boolean;
  origin_card_id: string;
  new_card_id: string;
}

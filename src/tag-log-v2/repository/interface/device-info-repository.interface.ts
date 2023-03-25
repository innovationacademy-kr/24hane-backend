import { DeviceInfoDto } from 'src/tag-log-v2/dto/device-info.dto';

export interface IDeviceInfoRepository {
  /**
   * 모든 등록된 카드태깅 디바이스 정보를 가져옵니다.
   */
  findAll(): Promise<DeviceInfoDto[]>;
}

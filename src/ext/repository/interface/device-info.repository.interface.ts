import { DeviceDto } from 'src/ext/dto/device.dto';

export interface IDeviceInfoRepository {
  /**
   * 디바이스의 정보를 가져옵니다.
   */
  getDeviceInfo(id: number): Promise<DeviceDto>;
}
